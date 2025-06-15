import Card from "@/components/card";

export default async function Page() {

  const data = await fetch("http://localhost:3000/api/shutterfly");

  if (!data.ok){
    return <div>failed to fetch data!</div>;
  }


  const posts = await data.json();
  if (Array.isArray(posts)){
    return (
      <div className="grid gap-6 p-6">
        <h1 className="text-3xl font-bold"></h1>
        {posts.map((document, index) => (
          <div key={document._id || index} className="mb-4">
            <Card 
              data={document} 
              title={`${document.client_name} - ${document.rfp_name}`}
            />
          </div>
        ))}
      </div>
    );
  }
  // return (
  //   <div className="p-6">
  //     <h1 className="text-3xl font-bold mb-4">RFP Analysis</h1>
  //     <Card 
  //       data={posts} 
  //       title={`${posts.client_name} - ${posts.rfp_name}`}
  //     />
  //   </div>
  // );
}