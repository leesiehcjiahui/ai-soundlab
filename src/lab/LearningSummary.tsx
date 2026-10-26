import type {Language} from '../../shared/contract';
import type {MissionId} from './model';
import {SparkleIcon} from './Icons';

const LESSONS = {
 bm: {
  vibration: {title:'Getaran menghasilkan bunyi',cause:'Apabila kamu memetik pembaris, hujungnya bergerak ulang-alik dengan cepat. Gerakan ini dipanggil getaran. Getaran pembaris menghasilkan bunyi.',remember:'Apabila getaran pembaris dihentikan, bunyi pembaris juga berhenti.',example:'Cuba sentuh leher kamu dengan lembut semasa bercakap. Kamu boleh merasai getaran. Graf mikrofon pula menunjukkan isyarat bunyi; lihat pembaris sendiri untuk memerhatikan getarannya.'},
  travel: {title:'Bunyi bergerak ke semua arah',cause:'Sumber yang bergetar menghasilkan bunyi. Bunyi bergerak melalui udara ke sekeliling sumber. Itulah sebabnya pendengar di hadapan, belakang, kiri dan kanan boleh mendengar.',remember:'Dalam udara yang sama, bunyi sampai serentak kepada pendengar pada jarak yang sama. Pendengar yang lebih jauh menerima bunyi kemudian.',example:'Apabila loceng sekolah berbunyi, murid di beberapa arah boleh mendengarnya. Lingkaran dalam simulasi menunjukkan sejauh mana bunyi telah sampai; animasi diperlahankan supaya kamu boleh melihatnya.'},
  echo: {title:'Bunyi boleh dipantulkan dan diserap',cause:'Apabila bunyi sampai ke permukaan, sebahagiannya boleh dipantulkan kembali. Pantulan yang didengar secara berasingan selepas bunyi asal dipanggil gema.',remember:'Dinding keras biasanya memantulkan lebih banyak bunyi. Langsir lembut menyerap sebahagian bunyi, jadi pantulannya biasanya lebih lemah.',example:'Kamu mungkin mendengar gema di dalam gua atau dewan kosong yang besar. Pada jarak sama melalui udara yang sama, bahan mengubah kekuatan pantulan dalam model ini; masa perjalanan bunyi adalah sama.'},
  detective: {title:'Kesan bunyi bergantung pada situasi',cause:'Satu bunyi boleh berfaedah atau memudaratkan mengikut tempat, masa dan orang yang mendengarnya. Dengar rakaman kamu dan kaitkan cirinya dengan satu situasi sebenar.',remember:'Bunyi yang kuat atau berulang boleh mengganggu tumpuan. Kurangkan bunyi pada sumber, jauhkan diri dengan selamat, atau gunakan penghalang yang sesuai.',example:'Loceng memberi isyarat waktu rehat. Namun, loceng yang berbunyi berulang kali ketika murid belajar boleh mengganggu mereka. Rakaman membantu kamu mendengar semula dan menerangkan sebab pilihan kamu.'},
 },
 en: {
  vibration: {title:'Vibrations produce sound',cause:'When you pluck the ruler, its end moves back and forth quickly. This movement is called vibration. The ruler’s vibration produces sound.',remember:'When the ruler’s vibration stops, its sound stops too.',example:'Gently touch your throat while speaking to feel a vibration. A microphone graph shows the sound signal; watch the ruler itself to observe its movement.'},
  travel: {title:'Sound travels in all directions',cause:'A vibrating source produces sound. Sound travels through the air around the source. This is why people in front, behind, to the left and to the right can hear it.',remember:'In the same air, sound reaches listeners at equal distances together. A listener farther away receives it later.',example:'When a school bell rings, pupils in different directions can hear it. The simulation’s rings show how far sound has reached; the animation is slowed so you can follow it.'},
  echo: {title:'Sound can be reflected and absorbed',cause:'When sound reaches a surface, some of it can reflect back. A reflection heard separately after the original sound is called an echo.',remember:'A hard wall usually reflects more sound. A soft curtain absorbs some sound, so its reflection is usually weaker.',example:'You may hear an echo in a cave or a large empty hall. At the same distance through the same air, the material changes reflection strength in this model; the sound’s travel time stays the same.'},
  detective: {title:'A sound’s effect depends on the situation',cause:'The same sound can be useful or harmful depending on the place, time and people listening. Replay your recording and connect what you hear to a real situation.',remember:'Loud or repeated sound can disturb concentration. Reduce noise at its source, move farther away safely, or use a suitable barrier.',example:'A bell tells pupils that break time has started. A bell ringing repeatedly while they study can disturb them. Your recording helps you listen again and explain your judgment.'},
 },
} as const;

export function LearningSummary({mission,language}:{mission:MissionId;language:Language}) {
 const lesson=LESSONS[language][mission];
 return <section className="learning-summary" aria-labelledby="learning-summary-title">
  <div className="learning-summary-label"><SparkleIcon size={24}/>{language==='bm'?'Mari fahami topik ini':'Understand the science'}</div>
  <h3 id="learning-summary-title">{lesson.title}</h3>
  <p>{lesson.cause}</p>
  <div className="learning-takeaway"><strong>{language==='bm'?'Ingat ini':'Remember'}</strong><p>{lesson.remember}</p></div>
  <p>{lesson.example}</p>
 </section>;
}
