const sampleComment = [
    {
        content: "This is a sample comment",
        replies: [
            {
                content: "This is a reply to the sample comment",
                replies: [
                    {
                        content: "This is a reply to the reply",
                        replies: []
                    }
                ]
            }
        ]
    },
    {
        content: "This is a Second comment",
        replies: [
            {
                content: "This is a reply to the second comment",
                replies: [
                    {
                        content: "This is a reply to the reply of the second comment",
                        replies: []
                    }
                ]
            }
        ]
    },
]

export default sampleComment;