export function pluralize(singular, plural, count) {
    if (count > 1) {
        return plural
    } else {
        return singular
    }
}