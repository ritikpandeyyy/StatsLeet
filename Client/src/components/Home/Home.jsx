/* eslint-disable react/no-unescaped-entities */
import UpcomingEvent from "./UpcomingEvent";
import UsedTechStack from "./UsedTechStack";
import FunnyCodeComponent from "./FunnyCodeComponent";
import Features from "./Features";
import statsDark from "./Screenshots/statsdark.png";
import statsLight from "./Screenshots/statslight.png";
import useTheme from "@/Contexts/Theme";

const Home = () => {
  const { themeMode } = useTheme();
  return (
    <div className="min-h-screen max-w-6xl flex flex-col h-full mx-auto items-center justify-center w-full px-6">
      <section className="my-8 text-center">
        <h2 className="text-xl sm:text-3xl font-bold mb-4">
          Track Your LeetCode Progress
        </h2>
        <p className="sm:text-lg text-center">
          Leetstats is developed for Proffesors to track their students'
          leetcode progress or for students to compete with their friends . Stay
          on top of your coding practice and logic building with our intuitive
          tracker.
        </p>
        <br />
        <p className="sm:text-lg text-center">
          "Every great accomplishment starts with a single line of code. Embrace
          the challenge, push boundaries, and transform your ideas into reality.
          <br /> Remember, the possibilities are limitless when you code with
          passion and persistence."
        </p>
      </section>

      <div className="my-4 mx-auto w-full max-w-6xl rounded-lg overflow-hidden shadow-sm shadow-foreground">
        <img
          src={themeMode === "dark" ? statsDark : statsLight}
          alt="Cover Image"
          loading="eager"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex flex-col sm:flex-row justify-center items-center mx-auto space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex flex-col justify-center sm:w-2/3 items-center rounded-lg shadow-inner shadow-foreground p-6 space-y-3">
          <h2 className="text-2xl font-semibold mb-1">
            Why do you think coding is boring?
          </h2>
          <p className="text-lg">
            Coding challenges your creativity and problem-solving skills,
            offering endless opportunities for innovation.
          </p>
          <p className="text-lg">
            With coding, you can create solutions that impact millions of lives,
            from apps to systems that power businesses globally.
          </p>
        </div>
        <FunnyCodeComponent />
      </div>

      <div className="text-center font-semibold my-6 text-3xl sm:text-5xl">
        Features
      </div>
      <Features />
      <UpcomingEvent />
      <UsedTechStack />
    </div>
  );
};

export default Home;
