const textArea = document.getElementById('text');
const keyArea = document.getElementById('key');
const languageButton = document.getElementById('language');
const encodingButton = document.getElementById('encoding');
const decodingButton = document.getElementById('decoding');
const hackButton = document.getElementById('hack'); 
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

function analyzeFrequency(text, language) {
  const alphabet = language === 'en' ? 'abcdefghijklmnopqrstuvwxyz' : 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя';
  const freq = {};
  for (let char of alphabet) {
    freq[char] = 0;
  }
  for (let char of text.toLowerCase()) {
    if (alphabet.includes(char)) {
      freq[char]++;
    }
  }
  return freq;
}


function guessKeyLength(text, language) {
  const alphabet = language === 'en' ? 'abcdefghijklmnopqrstuvwxyz' : 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя';
  let bestKeyLength = 1;
  let bestScore = 0;

  for (let keyLength = 1; keyLength <= 10; keyLength++) { 
      let score = 0;
      for (let i = 0; i < keyLength; i++) {
          let subtext = "";
          for (let j = i; j < text.length; j += keyLength) {
              const char = text[j].toLowerCase();
              if (alphabet.includes(char)) {
                  subtext += char;
              }
          }
          const freq = analyzeFrequency(subtext, language);
          if (language === 'en') { score += freq['e']; } else { score += freq['о']; }
      }

      if (score > bestScore) {
          bestScore = score;
          bestKeyLength = keyLength;
      }
  }
  return bestKeyLength;
}

function hackVigenereCipher(text, language) {
    const keyLength = guessKeyLength(text, language);
    const alphabet = language === 'en' ? 'abcdefghijklmnopqrstuvwxyz' : 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя';
    let key = "";

    for (let i = 0; i < keyLength; i++) {
        let subtext = "";
        for (let j = i; j < text.length; j += keyLength) {
            const char = text[j].toLowerCase();
            if (alphabet.includes(char)) {
                subtext += char;
            }
        }

        const freq = analyzeFrequency(subtext, language);
        let mostFrequentChar = '';
        let maxFreq = 0;
        for (const char in freq) {
          if (freq[char] > maxFreq) {
            maxFreq = freq[char];
            mostFrequentChar = char;
          }
        }

        let keyChar;
        if (language === 'en') { keyChar = alphabet[ (alphabet.indexOf(mostFrequentChar) - alphabet.indexOf('e') + alphabet.length) % alphabet.length ]; }
        else { keyChar = alphabet[ (alphabet.indexOf(mostFrequentChar) - alphabet.indexOf('о') + alphabet.length) % alphabet.length ]; } // для русского
        key += keyChar;
    }
    return vigenereCipher(text, key, language, false); 
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

hackButton.addEventListener('click', () => {
  const text = textArea.value;
  const language = languageButton.value;
  resultArea.value = hackVigenereCipher(text, language);
});
