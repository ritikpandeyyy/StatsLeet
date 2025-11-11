import { useEffect, useState } from "react";

const FunnyCodeComponent = () => {
  const [randomCode, setRandomCode] = useState("");

  // List of random code snippets
  const codeSnippets = [
    `while (alive) {
    eat();
    sleep();
    code();
    repeat();
  }`,
    `if (success == true) {
    celebrate();
  } else {
    tryagain();
    be_awesome();
  }`,
    `function logic() {
    if (happy)
      code();
    else
      logic();
  }`
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * codeSnippets.length);
      setRandomCode(codeSnippets[randomIndex]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      id="funnyCode"
      className=" flex text-lg sm:w-1/3 justify-center items-center p-6 rounded-lg shadow-inner shadow-foreground"
    >
      <pre className="">
        <code className="">{randomCode}</code>
      </pre>
    </div>
  );
};

export default FunnyCodeComponent;
