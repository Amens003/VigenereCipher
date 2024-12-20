const textArea = document.getElementById('text');
const keyArea = document.getElementById('key');
const languageButton = document.getElementById('language');
const encodingButton = document.getElementById('encoding');
const decodingButton = document.getElementById('decoding');
const resultArea = document.getElementById('result');

function vigenereCipher(text, key, language, encoding) {
  let result = '';
  const alphabet = language === 'en' ? 'abcdefghijklmnopqrstuvwxyz' : 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя';
  const alphabetLength = alphabet.length;
  let keyIndex = 0;

  for (let i = 0; i < text.length; i++) {
    const char = text[i].toLowerCase();
    const index = alphabet.indexOf(char);

    if (index === -1) {
      result += text[i]; 
    } else {
      const keyChar = key[keyIndex % key.length].toLowerCase();
      const keyIndexShift = alphabet.indexOf(keyChar);
      let shiftedIndex = (index + (encoding ? keyIndexShift : -keyIndexShift) + alphabetLength) % alphabetLength;
      result += text[i] === char ? alphabet[shiftedIndex] : alphabet[shiftedIndex].toUpperCase();
      keyIndex++;
    }
  }
  return result;
}


encodingButton.addEventListener('click', () => {
  const text = textArea.value;
  const key = keyArea.value;
  const language = languageButton.value;

  resultArea.value = vigenereCipher(text, key, language, true);
});

decodingButton.addEventListener('click', () => {
    const text = textArea.value;
    const key = keyArea.value;
    const language = languageButton.value;

    resultArea.value = vigenereCipher(text, key, language, false);
  });
