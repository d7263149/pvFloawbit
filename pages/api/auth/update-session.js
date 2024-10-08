import { getServerSession } from "next-auth/next";
import { authOptions } from "./[...nextauth]"; // Import your authOptions

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  
  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Perform actions to update session data, such as fetching new profile info
  if (req.method === 'POST') {
    const datas = JSON.parse(req.body); // Extract key from POST body    console.log('if working')


    // You can also send the POST values back in the response for verification
    // return res.status(200).json({
    //   message: 'POST data received successfully',
    //   receivedData: JSON.parse(req.body),
    // });





    // res.status(200).json({ if:'working1 '+ key });
  session.user.role = datas?.key; // Example: updating the role
  }else{
    console.log('else working')
    // res.status(200).json({ else:'working1 '+ key });
    session.user.role = 'adminnotrecived'; // Example: updating the role

  }
  res.status(200).json({ session });
}
