interface sampleType {
    content: string,
    replies: sampleType[]
}

const Comment = ({sample, indent=0}:{sample:sampleType, indent?:number}) => {
  return (
    <div style={{marginBottom: indent? "1rem":"0"}}>
      <div className="flex">
        <div className="h-0.5" style={{width:`${indent}px`}}></div>{sample.content}
      </div>
      {
        sample.replies.length > 0 && 
        sample.replies.map((reply, index) => (
            <Comment key={index} sample={reply} indent={indent+35}/>
        ))
      }
    </div>
  )
}

export default Comment
