import { Filter } from "@/components/Filter/SearchFilter";
import NavBarMain from "@/components/NavBarMain";
import PropertieCard from "@/components/PropertieCard";
import SearchBar from "@/components/SearchBar";


export default function Home() {
  const data = Array(15).fill(1)
  return (
    <>
        <NavBarMain/>
        <div className="h-full w-fit flex justify-center items-start flex-col">
            <SearchBar/>
          
            <div className="flex justify-center items-center flex-wrap lg:mx-30 md:mx-2">
              {data.map((e,i)=><PropertieCard key={i}/>)}
            </div>
        </div>
    </>
  );
}
