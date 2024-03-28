function LandingPage() {
  return (
    <div className="flex flex-grow overflow-hidden bg-[url('./images/background.png')] bg-cover justify-center items-center" role="img" aria-label="A background image of a mother and her baby">
        <img
          className="w-[50rem]"
          src="/images/oliviahealth.svg"
          alt="Olivia Health logo"
          style={{ filter: "brightness(0) invert(1)" }}
        ></img>
      </div>
  )
}

export default LandingPage;