import { NextResponse } from "next/server";

const username = "Rishu-xd";

export async function GET(request: Request) {
  const requestedYear = new URL(request.url).searchParams.get("year");
  const year = requestedYear && /^(2023|2024|2025|2026)$/.test(requestedYear)
    ? requestedYear
    : "2026";

  const response = await fetch(`https://github.com/users/${username}/contributions?from=${year}-01-01&to=${year}-12-31`, {
    headers: {
      Accept: "text/html",
      "User-Agent": "portfolio-contribution-calendar",
    },
    next: { revalidate: 900 },
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: "GitHub contributions are temporarily unavailable." },
      { status: 502 },
    );
  }

  const html = await response.text();
  const activity = new Map<string, { level: number; count: number }>();
  const cellPattern = /<td[^>]*data-date="([^"]+)"[^>]*data-level="(\d+)"[^>]*>/g;
  let match = cellPattern.exec(html);

  while (match) {
    if (match[1].startsWith(`${year}-`)) {
      const cellStart = html.indexOf(`data-date="${match[1]}"`);
      const cellEnd = html.indexOf("</tool-tip>", cellStart);
      const cellHtml = html.slice(cellStart, cellEnd);
      const countMatch = cellHtml.match(/(\d[\d,]*) contributions?/i);

      activity.set(match[1], {
        level: Number(match[2]),
        count: countMatch ? Number(countMatch[1].replaceAll(",", "")) : 0,
      });
    }
    match = cellPattern.exec(html);
  }

  const start = new Date(Date.UTC(Number(year), 0, 1));
  start.setUTCDate(start.getUTCDate() - start.getUTCDay());
  const end = new Date(Date.UTC(Number(year), 11, 31));
  end.setUTCDate(end.getUTCDate() + (6 - end.getUTCDay()));
  const cells: { date: string; level: number }[] = [];
  const total = [...activity.values()].reduce((sum, cell) => sum + cell.count, 0);

  for (const date = new Date(start); date <= end; date.setUTCDate(date.getUTCDate() + 1)) {
    const dateString = date.toISOString().slice(0, 10);
    const cell = activity.get(dateString);
    cells.push({ date: dateString, level: cell?.level ?? 0 });
  }

  if (cells.length === 0) {
    return NextResponse.json(
      { error: "GitHub did not return a contribution calendar." },
      { status: 502 },
    );
  }

  return NextResponse.json({ username, total, year: Number(year), cells });
}
