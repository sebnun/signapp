const domains = ['gmail.com', 'hotmail.com', 'outlook.com'];
const levenshteinMax = 3; // >levenshteinMax should not be considered similar

/*returns an object of the form :
{ type: 'error', message: 'that doenst look like an email'}
or
{type: 'warning', sugestion: 'dsfds@dfg.com', isValidEmail: false}
or 
null
*/
function getFeedback(rawEmail) {
    if (rawEmail.trim() === '')
        return { type: 'error', message: `Email can't be empty!` };

    const pseudoEmail = rawEmail.toLowerCase();
    const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    //check if it's a proper email
    if (emailRegEx.test(pseudoEmail)) {
        const domain = pseudoEmail.split('@')[1];

        if (domains.includes(domain)) {
            return null; //if the domain is in domains, no need to suggest
        } else {
            //if its not in domains, see if it can find a similar domain
            const similarDomain = domains.reduce((acc, curr, i) => {
                //acc = {index: 7, distance: 4} or null

                const distance = levenshtein(domain, curr);

                if (distance < levenshteinMax && (acc === null || distance < acc.distance))
                    return { index: i, distance };

                return acc;
            }, null)

            if (similarDomain) {
                const suggestion = pseudoEmail.replace(domain, domains[similarDomain.index]);
                return { type: 'warning', suggestion, isValidEmail: true };
            } else {
                return null;
            }
        }
    } else { //its not a proper email, try to make it one
        for (const domain of domains) {
            //try to fix if its missing @
            if (!pseudoEmail.includes('@') && pseudoEmail.includes(domain) && emailRegEx.test(pseudoEmail.replace(domain, '@' + domain))) {
                return { type: 'warning',  suggestion: pseudoEmail.replace(domain, '@' + domain), isValidEmail: false };
            }

            //try to fix if its missing a . and domain to test has no subdomains
            if (!pseudoEmail.includes('.') && pseudoEmail.includes(domain.replace('.', '')) && emailRegEx.test(pseudoEmail.replace(domain.replace('.', ''), domain))) {
                return { type: 'warning',  suggestion: pseudoEmail.replace(domain.replace('.', ''), domain), isValidEmail: false };
            }

            //try to fix if its missing both @ and . and domain to test has no subdomains
            if (!pseudoEmail.includes('@') && !pseudoEmail.includes('.')) {
                const badDomain = domain.replace('.', '');
                if (pseudoEmail.includes(badDomain) && emailRegEx.test(pseudoEmail.replace(badDomain, '@' + domain))) {
                    return { type: 'warning',  suggestion: pseudoEmail.replace(badDomain, '@' + domain), isValidEmail: false };
                }
            }
        }

        return { type: 'error', message: `That doesn't look like a valid email!`};
    }
}

// based on the implementation here: https://github.com/hiddentao/fast-levenshtein
function levenshtein(str1, str2) {

    //Short cut cases  
    if (str1 === str2) return 0;
    if (!str1 || !str2) return Math.max(str1.length, str2.length);

    // two rows
    var prevRow = new Array(str2.length + 1);

    // initialise previous row
    for (var i = 0; i < prevRow.length; ++i) {
        prevRow[i] = i;
    }

    // calculate current row distance from previous row
    for (i = 0; i < str1.length; ++i) {
        var nextCol = i + 1;

        for (var j = 0; j < str2.length; ++j) {
            var curCol = nextCol;

            // substution
            nextCol = prevRow[j] + ((str1.charAt(i) === str2.charAt(j)) ? 0 : 1);
            // insertion
            var tmp = curCol + 1;
            if (nextCol > tmp) {
                nextCol = tmp;
            }
            // deletion
            tmp = prevRow[j + 1] + 1;
            if (nextCol > tmp) {
                nextCol = tmp;
            }

            // copy current col value into previous (in preparation for next iteration)
            prevRow[j] = curCol;
        }

        // copy last col value into previous (in preparation for next iteration)
        prevRow[j] = nextCol;
    }

    return nextCol;
};

export default getFeedback;