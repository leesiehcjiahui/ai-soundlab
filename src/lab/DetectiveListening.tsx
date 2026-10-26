import type {Language} from '../../shared/contract';
import type {Investigation} from './model';

export function DetectiveListening({language,work,update}:{language:Language;work:Investigation;update:(patch:Partial<Investigation>)=>void}) {
 const bm=language==='bm';
 const choices=[['short',bm?'Pendek, sekali':'One short sound'],['continuous',bm?'Berterusan':'Continuous'],['repeated',bm?'Berulang kali':'Repeated']] as const;
 function set(field:string,value:string){update({experiment:{...work.experiment,[field]:value}});}
 return <section className="detective-listening" aria-labelledby="detective-listening-title">
  <strong className="detective-purpose">{bm?'Misi kamu: bantu seseorang mengurangkan gangguan bunyi.':'Your mission: help someone reduce a sound disturbance.'}</strong>
  <h3 id="detective-listening-title">{work.observed?bm?'Sudah ada bunyi. Apa seterusnya?':'You have a sound. What next?':bm?'Dengar → cari petunjuk → buat keputusan':'Listen → find clues → make a decision'}</h3>
  <ol><li>{bm?'Mainkan semula rakaman di atas, atau dengar bunyi pilihan kamu.':'Replay the recording above, or listen to your chosen sound.'}</li><li>{bm?'Pilih corak bunyi di bawah. Bayangkan siapa yang mendengarnya dalam situasi kamu.':'Choose its pattern below. Think about who hears it in your situation.'}</li><li>{bm?'Catat apa yang kamu dengar di ruangan pemerhatian. Dalam Terangkan, tentukan kesannya dan cadangkan satu tindakan.':'Describe what you hear in the observation box. In Explain, judge its effect and suggest an action.'}</li></ol>
  <fieldset><legend>{bm?'Apakah corak yang kamu dengar?':'What pattern do you hear?'}</legend><div className="detective-patterns">{choices.map(([value,label])=><label key={value}><input type="radio" name="sound-pattern" value={value} checked={work.experiment.soundPattern===value} onChange={()=>set('soundPattern',value)}/>{label}</label>)}</div></fieldset>
  <label className="detective-setting">{bm?'Dalam situasi apakah kamu menilai bunyi ini?':'In what situation are you judging this sound?'}<input type="text" maxLength={80} value={String(work.experiment.soundSetting??'')} placeholder={bm?'Contoh: murid sedang belajar di kelas':'Example: pupils studying in a classroom'} onChange={event=>set('soundSetting',event.target.value)}/></label>
  <p>{bm?'Contoh: ketukan pensel berulang boleh mengganggu rakan yang membaca. Satu tindakan ialah berhenti mengetuk ketika rakan membaca. AI membantu menyemak alasan kamu berdasarkan catatan, tanpa mendengar rakaman.':'Example: repeated pencil tapping can disturb a friend who is reading. One action is to stop tapping while they read. AI checks your reasoning from your notes, without listening to the recording.'}</p>
 </section>;
}

export function DetectiveEvidence({language,work}:{language:Language;work:Investigation}) {
 const bm=language==='bm';
 return <section className="detective-evidence"><strong>{bm?'Gunakan petunjuk bunyi kamu':'Use your sound clues'}</strong><p>{work.observation}</p>{work.experiment.soundSetting?<p><b>{bm?'Situasi':'Situation'}:</b> {String(work.experiment.soundSetting)}</p>:null}<small>{bm?'Siapakah yang dibantu atau diganggu dalam situasi ini? Berikan sebab berdasarkan apa yang kamu dengar.':'Who is helped or disturbed in this situation? Give a reason based on what you heard.'}</small></section>;
}
