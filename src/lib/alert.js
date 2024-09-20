const Alert = ({type}) => {
    if(type === 'warn'){
      return (
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong class="font-bold">Warn</strong>
          <span class="block sm:inline">You can submit only once.</span>
          <span class="absolute top-0 bottom-0 right-0 px-4 py-3">
          </span>
        </div>
      )
    }
    return (
      <div class="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative" role="alert">
        <strong class="font-bold">Info</strong>
          <span class="block sm:inline">Your information has been sent to Billy.</span>
          <span class="absolute top-0 bottom-0 right-0 px-4 py-3">
          </span>
     </div>
    )
  }

  export default Alert