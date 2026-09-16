import DepthText from "@/components/DepthText";

export default function Page() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center" >
      <div className="cursor-pointer"> <DepthText
  text="RISHU XD"
  layers={20}
  activationDistance={300}
  // defaultPosition={[5, 5]}
  // mouseControlled={true}
/></div>
   
    </main>
  );
}