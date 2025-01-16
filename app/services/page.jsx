"use client";

import { BsArrowDownRight } from "react-icons/bs";
import Link from "next/link";

import { motion } from "framer-motion";

const services = [
  {
    num: "01",
    title: "Conference",
    Description:
      "I have participated at AIP Publishing, ICMTA'21 at SRMIST, and SRM Research Day",
    href: "https://www.linkedin.com/in/t-sriramasivam/",
  },
  {
    num: "02",
    title: "Workshop",
    Description:
      "I have participated at Actions On Google (SRM Developer Students Club), Aaruush (National-level techno-management club), and Aglie DevOps (Renault-Nissan-Mitsubishi)",
    href: "https://www.linkedin.com/in/t-sriramasivam/",
  },
  {
    num: "03",
    title: "Hackathon",
    Description:
      "I have participated DBM Hackthon (SRMIST), 2x Top 5 at Opentext Hackathon, and Google Foobar challenge. ",
    href: "https://www.linkedin.com/in/t-sriramasivam/",
  },
  {
    num: "04",
    title: "Publication",
    Description:
      "Secure E-Voting System using Blockchain Based on Solidity Technology at AIP and Secure Patient Records using multi-level encryption at SRM Research Day",
    href: "https://aip.scitation.org/doi/abs/10.1063/5.0109146",
  },
];

const Services = () => {
  return (
    <section className="min-h-[80vh] flex flex-col justify-center py-12 xl:py-0">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: { delay: 2.4, duration: 0.4, ease: "easeIn" },
          }}
          className="grid grid-cols-1 md:grid-cols-2 gap-[60px]"
        >
          {services.map((service, index) => {
            return (
              <div
                key={index}
                className="flex-1 flex flex-col justify-center gap-6 group"
              >
                <div className="w-full flex justify-between items-center">
                  <div className="text-5xl font-extrabold text-outline text-transparent group-hover:text-outline-hover transition-all duration-500">
                    {service.num}
                  </div>
                  <Link
                    href={service.href}
                    className="w-[70px] h-[70px] rounded-full bg-white group-hover:bg-accent transition-all duration-500 flex justify-center items-center hover:-rotate-45"
                  >
                    <BsArrowDownRight className="text-primary text-3xl" />
                  </Link>
                </div>
                <h2 className="text-[42px] font-bold leading-none text-white group-hover:text-accent transition-all duration:500">
                  {service.title}
                </h2>
                <p className="text-white/60">{service.Description}</p>
                <div className="border-b border-white/20 w-full"></div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
