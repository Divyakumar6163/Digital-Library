import React from "react";

const AboutSection = () => {
  return (
    <section className="bg-white dark:bg-gray-900" id="about">
      <div className="gap-16 items-center py-8 px-4 mx-auto max-w-screen-xl lg:grid lg:grid-cols-2 lg:py-16 lg:px-6">
        <div className="font-light text-gray-500 sm:text-lg dark:text-gray-400">
          <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
            Want to Know About Us?
          </h2>
          <p className="mb-4">
            We are readers, curators, and book enthusiasts. Innovators in the
            world of literature. Small enough to provide a personal touch, but
            vast enough to offer the diverse collection you crave. We blend
            passion and expertise to bring you an unparalleled reading
            experience, tailored to your pace and preferences.
          </p>
          <p>
            We are readers, curators, and book enthusiasts. Innovators in the
            world of literature. Small enough to provide a personal touch.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-8">
          <img
            className="w-full rounded-lg"
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/content/office-long-2.png"
            alt="office content 1"
          />
          <img
            className="mt-4 w-full lg:mt-10 rounded-lg"
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/content/office-long-1.png"
            alt="office content 2"
          />
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
