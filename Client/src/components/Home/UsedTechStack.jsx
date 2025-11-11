import reactimg from './TechStack/reactd.svg';
import reduximg from './TechStack/redux.png';
import appwriteimg from './TechStack/appwrite.png';
import graphqlimg from './TechStack/graphQl.jpg';
import apolloimg from './TechStack/apollo.png';
import expressimg from './TechStack/expressjs.png';
import tailwindimg from './TechStack/tailwind.png';
import shadcnimg from './TechStack/shadcn.png';


const techStack = [
  { name: 'React', logo: reactimg },
  { name: 'Tailwind', logo: tailwindimg },
  { name: 'Shadcn', logo: shadcnimg },
  { name: 'Redux', logo: reduximg },
  { name: 'Appwrite', logo: appwriteimg },
  { name: 'GraphQL', logo: graphqlimg },
  { name: 'Apollo', logo: apolloimg },
  { name: 'Express', logo: expressimg },
]

const UsedTechStack = () => {
  return (
    <div className="w-full flex flex-wrap justify-center rounded-lg shadow-inner shadow-foreground my-8">
      <h2 className=" text-ground w-full text-3xl font-bold mb-4 text-center">Tech Stack</h2>
      <div className="grid grid-cols-2 sm:grid-cols-8 gap-5">
      {techStack.map((tech, index) => (
        <div key={index} className=" flex flex-col items-center m-4 transform transition-transform duration-300 hover:scale-110">
          <img src={tech.logo} alt={tech.name} loading='lazy' className="h-16 w-16 object-contain" />
          <span className="text-lg font-medium">{tech.name}</span>
        </div>
      ))}
      </div>
    </div>
  );
}

export default UsedTechStack;
