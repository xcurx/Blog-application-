export function recursiveComments(replies,topMatch){
    let newReplies = []

    const repliesMap = new Map(replies.map(reply => [reply?._id.toString(), { ...reply, replies: [] }]));
    
    const buildNestedReplies = (reply) => {
        const children = [...repliesMap.values()].filter(r => r?.commentRepliedTo.toString() === reply?._id.toString());
        children.forEach(child => {
            buildNestedReplies(child);
            reply.replies.push(child);
        });
    };
    
    const topLevelReplies = [...repliesMap.values()].filter(reply => reply?.commentRepliedTo.toString() === topMatch);

    topLevelReplies.forEach(reply => {
        buildNestedReplies(reply);
        newReplies.push(reply);
    });

    return newReplies
}

