async function containsTerms(text, terms) {

    const apiKey = 'OPENAI KEY HERE'; // Replace with your OpenAI API key

    const url = 'https://api.openai.com/v1/chat/completions';

    const prompt = `Is the following sentence related to, or contain, ideas/terms related to any of the following terms: ${terms}? Respond with TRUE or FALSE only.\n\n"${text}"`;


    const response = await fetch(url, {

        method: 'POST',

        headers: {

            'Content-Type': 'application/json',

            'Authorization': `Bearer ${apiKey}`

        },

        body: JSON.stringify({

            model: 'gpt-3.5-turbo',

            messages: [{ role: 'user', content: prompt }],

            max_tokens: 1,

            temperature: 0

        })

    });


    const data = await response.json();

    const result = data.choices[0].message.content.trim();

    console.log(`Response from API: ${result}`);

    return result === 'TRUE';

}


async function processPosts(filterFunction, terms = null) {

    console.log("Starting to process posts...");


    // Get all posts

    const posts = document.querySelectorAll('[data-testid="tweet"]');

    console.log(`Found ${posts.length} posts.`);


    for (const [index, post] of posts.entries()) {

        console.log(`Processing post ${index + 1}...`);


        // Get the post text

        const postTextElement = post.querySelector('[data-testid="tweetText"]');

        if (postTextElement) {

            const postText = postTextElement.innerText;

            console.log(`Post text: "${postText}"`);


            // Apply the filter function

            if (await filterFunction(postText, terms)) {

                console.log(`Post ${index + 1} matches the filter criteria. Removing post.`);

                post.remove();

            } else {

                console.log(`Post ${index + 1} does not match the filter criteria. Keeping post.`);

            }

        } else {

            console.log(`Post ${index + 1} does not have a text element.`);

        }

    }


    console.log("Finished processing posts.");

}


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

    if (request.action === "filterUppercase") {

        processPosts(containsUppercase);

    } else if (request.action === "filterWater") {

        processPosts(containsIdeaOfWater);

    } else if (request.action === "filterByTerms") {

        const terms = request.terms;

        processPosts(containsTerms, terms);

    }

    sendResponse({status: "done"});

});
