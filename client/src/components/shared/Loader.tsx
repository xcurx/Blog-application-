const Loader = ({height = "h-full"}) => {
  return (
    <div className={`flex justify-center items-center w-full ${height}`}>
        <span className='loader'></span>
    </div>
  )
}

export default Loader
