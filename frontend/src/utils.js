export function pluralize(singular, plural, count) {
    /**
     * Determines if the singular or plural form of a word should be used
     * @param   {String}  singular  Singular form of the word
     * @param   {String}  plural    Plural form of the word
     * @param   {float}   count     Count of object(s)/unit(s) to determine the singularity on
     * @return  {String}            Proper form of the word
     **/
    if (count > 1) {
        return plural
    } else {
        return singular
    }
}