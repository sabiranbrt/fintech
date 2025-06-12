export const wordCapitalize = (inputString: string) => {
  if (!inputString) return inputString;

  return inputString
    .replace(/[_\-/\\]/g, " ")
    .split(" ")
    .map(
      (eachWord) =>
        eachWord.charAt(0).toUpperCase() + eachWord.slice(1).toLocaleLowerCase()
    )
    .join(" ");
}
