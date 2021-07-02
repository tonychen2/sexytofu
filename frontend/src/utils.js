export function pluralize(singular, plural, count) {
    /**
     * Determines if the singular or plural form of a word should be used
     *
     * @param   {String}  singular  Singular form of the word
     * @param   {String}  plural    Plural form of the word
     * @param   {float}   count     Count of object(s)/unit(s) to determine the singularity on
     *
     * @return  {String}            Proper form of the word
     **/
    if (count > 1) {
        return plural
    } else {
        return singular
    }
}

export function joinText(t1, t2) {
    /**
     * Join two Strings, making sure there is a single space in between, and the second one is capitalized where appropriate
     *
     * @param   {String}  t1  Text to be joined in front
     * @param   {String}  t2  Text to be joined behind
     *
     * @return  {String}      Properly joined new text
     **/
    // Decide if a space needs to be added between t1 and t2
    if (t1.slice(-1) !== ' ') {
        t1 += ' '
    }

    // Decide if first letter of t2 needs to be capitalized
    if (['.', '!', '?'].includes(t1.slice(-2, -1))) {
        t2 = t2[0].toUpperCase() + t2.slice(1)
    }

    return t1 + t2
}