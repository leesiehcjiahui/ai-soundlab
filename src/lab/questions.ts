import type { Language } from '../../shared/contract';
import type { MissionId } from './model';
interface MissionQuestions {
  title:string; question:string; instruction:string; predict:string; reasonHelp:string;
  steps:string[]; observe:string; observeHints:string[]; observeStarter:string;
  explain:string; explainHints:string[]; explainStarter:string; fact:string;
}
export const MISSION_COPY:Record<Language,Record<MissionId,MissionQuestions>> = {
  bm: {
    vibration: {
      title:'Kenali Getaran', question:'Apakah yang berlaku apabila pembaris dipetik?',
      instruction:'Dengan bantuan guru, pegang pembaris di atas meja. Biarkan satu hujung terjulur keluar dari meja.',
      predict:'Jika kamu memetik hujung pembaris itu, adakah kamu akan mendengar bunyi?',
      reasonHelp:'Fikirkan apa yang mungkin berlaku pada hujung pembaris selepas dipetik.',
      steps:['Petik hujung pembaris perlahan-lahan. Lihat pergerakannya dan dengar bunyinya.','Pegang hujung pembaris itu dengan lembut supaya pergerakannya berhenti. Dengar semula.'],
      observe:'Apakah yang kamu lihat dan dengar?',
      observeHints:['Selepas dipetik, bagaimanakah hujung pembaris bergerak?','Apabila pergerakan pembaris dihentikan, apakah yang berlaku pada bunyinya?'],
      observeStarter:'Selepas dipetik, pembaris ____. Apabila pergerakannya berhenti, bunyi ____.',
      explain:'Bagaimanakah pembaris menghasilkan bunyi?',
      explainHints:['Hubungkan pergerakan pembaris dengan bunyi yang kamu dengar.','Bergetar bermaksud bergerak ulang-alik dengan cepat. Gunakan perkataan ini jika sesuai.'],
      explainStarter:'Pembaris menghasilkan bunyi apabila ____. Saya tahu kerana ____.',
      fact:'Bergetar bermaksud bergerak ulang-alik dengan cepat. Bunyi dihasilkan oleh getaran.'
    },
    travel: {
      title:'Bunyi Bergerak', question:'Siapakah yang akan menerima bunyi?',
      instruction:'Sumber bunyi berada di tengah rajah. Empat pendengar berada di sekelilingnya.',
      predict:'Adakah keempat-empat pendengar akan menerima bunyi daripada sumber di tengah?',
      reasonHelp:'Lihat kedudukan pendengar di kiri, kanan, atas dan bawah sumber dalam rajah.',
      steps:['Biarkan semua pendengar pada jarak yang sama. Tekan Jalankan simulasi.','Pilih seorang pendengar dan jauhkan kedudukannya. Jalankan simulasi sekali lagi.'],
      observe:'Siapakah yang menerima bunyi dahulu?',
      observeHints:['Apabila jarak semua pendengar sama, adakah bunyi tiba serentak?','Apabila seorang pendengar dijauhkan, adakah dia menerima bunyi lebih awal atau lebih lewat?'],
      observeStarter:'Jarak sama: ____. Apabila seorang pendengar lebih jauh: ____.',
      explain:'Ke arah manakah bunyi bergerak?',
      explainHints:['Gunakan kedudukan keempat-empat pendengar untuk menerangkan jawapan kamu.','Terangkan juga mengapa pendengar yang lebih jauh menerima bunyi pada masa yang berbeza.'],
      explainStarter:'Bunyi bergerak ke ____. Pendengar yang lebih jauh menerima bunyi ____ kerana ____.',
      fact:'Lingkaran dalam rajah menunjukkan sejauh mana bunyi telah sampai. Perhatikan pendengar yang menerima bunyi.'
    },
    echo: {
      title:'Cabaran Gema', question:'Dinding atau langsir: pantulan manakah lebih kuat?',
      instruction:'Bandingkan bunyi yang dipantulkan oleh dinding keras dan langsir lembut dalam simulasi.',
      predict:'Adakah bunyi pantulan daripada dinding keras dan langsir lembut sama kuat?',
      reasonHelp:'Fikirkan perbezaan antara permukaan dinding dan kain langsir.',
      steps:['Pilih Dinding keras. Jalankan simulasi dan perhatikan bunyi yang kembali.','Pilih Langsir lembut. Kekalkan jarak yang sama dan jalankan simulasi sekali lagi.'],
      observe:'Permukaan manakah menghasilkan pantulan bunyi yang lebih kuat?',
      observeHints:['Bandingkan dinding dengan langsir dalam simulasi.','Tandakan Bunyi simulasi untuk mendengar contoh semasa simulasi berjalan. Mulakan dengan kelantangan rendah.'],
      observeStarter:'Pantulan daripada ____ lebih kuat berbanding ____.',
      explain:'Mengapakah kekuatan bunyi pantulan itu berbeza?',
      explainHints:['Fikirkan sama ada permukaan itu memantulkan atau menyerap sebahagian bunyi.','Berikan satu contoh tempat kamu boleh mendengar gema.'],
      explainStarter:'Pantulan bunyi berbeza kerana ____. Contoh tempat yang menghasilkan gema ialah ____.',
      fact:'Pantulan berlaku apabila bunyi terkena permukaan dan kembali. Gema ialah bunyi pantulan yang didengar semula secara berasingan selepas bunyi asal.'
    },
    detective: {
      title:'Detektif Bunyi AI', question:'Bunyi ini membantu atau mengganggu?',
      instruction:'Pilih satu bunyi yang selamat untuk disiasat. Kamu boleh mendengar, merakam atau memilih fail bunyi.',
      predict:'Bolehkah bunyi yang membantu kita juga mengganggu orang lain?',
      reasonHelp:'Bayangkan loceng sekolah. Fikirkan kegunaannya dan kesannya jika berbunyi berulang kali semasa belajar.',
      steps:['Dengar bunyi pilihan kamu pada kelantangan rendah. Jangan hasilkan bunyi yang terlalu kuat.','Catat sumber bunyi dan tempat kamu mendengarnya. Jika tidak tahu sumbernya, tulis “belum pasti”.'],
      observe:'Apakah bunyi yang kamu pilih dan di manakah kamu mendengarnya?',
      observeHints:['Nyatakan apa yang kamu dengar, contohnya bunyi pendek, panjang atau berulang.','Namakan sumber hanya jika kamu mengetahuinya. Kamu tidak perlu meneka.'],
      observeStarter:'Saya mendengar ____ di ____. Bunyi itu ____. Sumbernya ____.',
      explain:'Mengapakah kamu memilih jawapan itu untuk bunyi ini?',
      explainHints:['Siapakah yang dibantu atau diganggu oleh bunyi pilihan kamu?','Ceritakan satu keadaan yang menunjukkan kesan bunyi itu.'],
      explainStarter:'Saya memilih ____ kerana ____. Contohnya, ____.',
      fact:'Bunyi yang sama boleh membantu dalam satu keadaan dan mengganggu dalam keadaan lain.'
    }
  },
  en: {
    vibration: {
      title:'Discover Vibration', question:'What happens when you pluck a ruler?',
      instruction:'With your teacher’s help, hold a ruler on a desk. Leave one end sticking out over the edge.',
      predict:'If you pluck that end of the ruler, will you hear a sound?',
      reasonHelp:'Think about what might happen to the end of the ruler after you pluck it.',
      steps:['Gently pluck the end of the ruler. Watch how it moves and listen.','Gently hold that end to stop it moving. Listen again.'],
      observe:'What did you see and hear?',
      observeHints:['How did the end of the ruler move after you plucked it?','What happened to the sound when you stopped the ruler moving?'],
      observeStarter:'After plucking, the ruler ____. When it stopped moving, the sound ____.',
      explain:'How does the ruler make a sound?',
      explainHints:['Link the ruler’s movement to the sound you heard.','Vibrating means moving back and forth quickly. Use this word if it fits your explanation.'],
      explainStarter:'The ruler makes a sound when ____. I know because ____.',
      fact:'Vibrating means moving back and forth quickly. Sound is produced by vibration.'
    },
    travel: {
      title:'Sound Travels', question:'Who will receive the sound?',
      instruction:'The sound source is in the middle of the diagram. Four listeners are around it.',
      predict:'Will all four listeners receive sound from the source in the middle?',
      reasonHelp:'Look at the listeners to the left, right, above and below the source in the diagram.',
      steps:['Leave all listeners at the same distance. Press Run simulation.','Choose one listener and move them farther away. Run the simulation again.'],
      observe:'Who receives the sound first?',
      observeHints:['When all distances are equal, does the sound reach everyone together?','When one listener is farther away, do they receive the sound earlier or later?'],
      observeStarter:'Equal distances: ____. With one listener farther away: ____.',
      explain:'In which directions does the sound travel?',
      explainHints:['Use the positions of all four listeners to explain your answer.','Also explain why the farther listener receives the sound at a different time.'],
      explainStarter:'Sound travels ____. The farther listener receives it ____ because ____.',
      fact:'The rings show how far the sound has reached. Watch which listeners receive it.'
    },
    echo: {
      title:'Echo Challenge', question:'Wall or curtain: which reflection is stronger?',
      instruction:'Compare sound reflected by a hard wall and a soft curtain in the simulation.',
      predict:'Will sound reflected by a hard wall and a soft curtain be equally strong?',
      reasonHelp:'Think about how a wall’s surface differs from curtain fabric.',
      steps:['Choose Hard wall. Run the simulation and watch the sound return.','Choose Soft curtain. Keep the same distance and run the simulation again.'],
      observe:'Which surface gives a stronger sound reflection?',
      observeHints:['Compare the wall and the curtain in the simulation.','Run the simulation to hear the example. Start with a low volume.'],
      observeStarter:'The reflection from ____ is stronger than the reflection from ____.',
      explain:'Why are the sound reflections different in strength?',
      explainHints:['Think about whether each surface reflects or absorbs some sound.','Give one example of a place where you could hear an echo.'],
      explainStarter:'The reflections differ because ____. One place that produces an echo is ____.',
      fact:'Reflection happens when sound hits a surface and returns. An echo is reflected sound heard separately after the original sound.'
    },
    detective: {
      title:'AI Sound Detective', question:'Does this sound help or disturb people?',
      instruction:'Choose one safe sound to investigate. You can listen, record it or choose a sound file.',
      predict:'Can a sound that helps us also disturb other people?',
      reasonHelp:'Think about a school bell. What is it useful for, and what if it rings repeatedly during a lesson?',
      steps:['Listen to your chosen sound at a low volume. Do not make very loud sounds.','Note the source and where you heard it. If you do not know the source, write “not sure yet”.'],
      observe:'Which sound did you choose, and where did you hear it?',
      observeHints:['Describe what you heard, such as a short, long or repeated sound.','Name the source only if you know it. You do not need to guess.'],
      observeStarter:'I heard ____ at ____. The sound was ____. Its source was ____.',
      explain:'Why did you choose that answer for this sound?',
      explainHints:['Who is helped or disturbed by your chosen sound?','Describe one situation that shows the sound’s effect.'],
      explainStarter:'I chose ____ because ____. For example, ____.',
      fact:'The same sound can help in one situation and disturb people in another.'
    }
  }
};
