import Card from "@/components/card";
import dbData from '../lib/db.json';
export default async function Page() {

  const data = await fetch("http://localhost:3000/api/shutterfly");
  
  if (!data.ok){
    return <div>failed to fetch data!</div>
  }
const posts = await data.json();

// const posts = await dbData;
  if (Array.isArray(posts)){
    return (
      <div className="grid gap-6 p-6">
        <h1 className="text-3xl font-bold"></h1>
        {posts.map((document, index) => (
          <div key={document._id || index} className="mb-4">
            <Card 
              data={document} 
              title={document.project_name ? `${document.client_name} - ${document.project_name}`: document.client_name}     
            />
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">RFP Analysis</h1>
      <Card data={posts} title={`${posts.client_name} RFP`} />
    </div>
  );
}