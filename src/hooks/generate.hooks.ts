import axiosInstance from "@/helper/axiosInstance";
import toast from "react-hot-toast";

const getGenerate = async(data : any)=>{
    try{
        const responsePromise =  axiosInstance.post("/generate",data);
        toast.promise(responsePromise,{
            loading : "generating plan",
            success : "generated",
            error : "error on generating",
        })
        const response = await responsePromise;
        return response.data;
    }catch(e:any){
        const error = e.response?.data?.message ;
        console.log(error);
    }
}

export default getGenerate;