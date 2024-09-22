import React, {useEffect, useState} from 'react';
import {animated} from '@react-spring/web';
import axios from 'axios';
import { Buffer } from 'buffer';
import {firestore} from './lib/firebase';
import { RotatingLines } from 'react-loader-spinner';
import Alert from './lib/alert';

function App() {
  const [name, setName] = useState('')
  const [intro, setIntro] = useState('')
  const [firstphone, setFirstPhone] = useState('')
  const [secondphone, setSecondPhone] = useState('')
  const [thirdphone, setThirdPhone] = useState('')
  const [fourthphone, setFourthPhone] = useState('')
  const [image, setImage] = useState(0)
  const [isAlert, setIsAlert] = useState(false);
  const [alertType, setAlertType] = useState('info')
  const [isLoading, setIsLoading] = useState(false);

  const handleName = (e) => {
    setName(e.target.value)
  }
  const handleIntro = (e) => {
    setIntro(e.target.value)
  }
  const handlePhone = (nth, e) => {
    const value = parseInt(e.target.value)
    if(nth === 1){
      setFirstPhone(value)
    }
    else if(nth === 2){
      setSecondPhone(value)
    }
    else if(nth === 3){
      setThirdPhone(value)
    }
    else if(nth === 4){
      setFourthPhone(value)
    }
  }

  const checkValidation = () => {
    if (!name || !intro || !firstphone || !secondphone || !thirdphone || !fourthphone) return false
    return true
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setImage((prev) => (prev + 1) % 6)
    }, 2000)

    return () => clearInterval(interval)
  }, [])
  const sendMessage = async() => {
    setIsLoading(true)
    try{
      const isSubmit = Boolean(localStorage.getItem('submit'))
      if(isSubmit){ 
        setAlertType('warn');
        setIsAlert(true);
        setTimeout(()=>{
          setIsAlert(false)
        },1500)
        return 
      }

      const accountSid = process.env.REACT_APP_TWILIO_ACC_SID
      const authToken = process.env.REACT_APP_TWILIO_AUTH_TOKEN
      const auth = 'Basic ' + new Buffer(accountSid + ':' + authToken).toString('base64');
      console.log(auth)
      // return
      const url = process.env.REACT_APP_TWILIO_URL
      const details = {
          To: process.env.REACT_APP_BILLY_PHONE,
          From: process.env.REACT_APP_TWILIO_PHONE,
          Body: `Name : ${name}\nIntro :${intro}\nNumber : +${firstphone}${secondphone}${thirdphone}${fourthphone}`,
      };
      const formBody = [];
        for (var property in details) {
            const encodedKey = encodeURIComponent(property);
            const encodedValue = encodeURIComponent(details[property]);
            formBody.push(encodedKey + '=' + encodedValue);
        }

      const body = formBody.join('&');
      await axios.post(url, body,{
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            Authorization: auth,
        },
      })
      localStorage.setItem('submit', true);
      const collectionRef = firestore.collection('billy');
      const addData = {};
      addData['phone'] = `+${firstphone}${secondphone}${thirdphone}${fourthphone}`;
      addData['context'] = intro;
      await collectionRef
        .doc(name)
        .set(addData)
        .then(() => {
          setAlertType('info')
          setIsAlert(true);
          setTimeout(() => {
            setIsAlert(false);
          }, 1500);
        });
    } catch (e) {
      console.error('Error adding data:', e);
    } finally{
      setIsLoading(false);
    }
  }
  return (
    <>
    {isLoading && 
    <div className='flex justify-center items-center absolute w-full h-full z-10 align-bottom'>
        <RotatingLines
          style={{verticalAlign: 'bottom'}}
          strokeColor="grey"
          strokeWidth="5"
          animationDuration="0.75"
          width="50%"
          visible={true}
        />
    </div>
    }
    <div
      className='relative flex size-full min-h-screen flex-col bg-white justify-between group/design-root overflow-x-hidden'
      style={{fontFamily: 'Plus Jakarta Sans", "Noto Sans", sans-serif'}}
    >
      <div className='flex items-center bg-white p-4 pb-2 justify-between'>
        <div
          className='text-[#111418] flex size-12 shrink-0 items-center'
          data-icon='Cake'
          data-size='24px'
          data-weight='regular'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='24px'
            height='24px'
            fill='currentColor'
            viewBox='0 0 256 256'
          >
            <path d='M232,112a24,24,0,0,0-24-24H136V79a32.06,32.06,0,0,0,24-31c0-28-26.44-45.91-27.56-46.66a8,8,0,0,0-8.88,0C122.44,2.09,96,20,96,48a32.06,32.06,0,0,0,24,31v9H48a24,24,0,0,0-24,24v23.33a40.84,40.84,0,0,0,8,24.24V200a24,24,0,0,0,24,24H200a24,24,0,0,0,24-24V159.57a40.84,40.84,0,0,0,8-24.24ZM112,48c0-13.57,10-24.46,16-29.79,6,5.33,16,16.22,16,29.79a16,16,0,0,1-32,0ZM40,112a8,8,0,0,1,8-8H208a8,8,0,0,1,8,8v23.33c0,13.25-10.46,24.31-23.32,24.66A24,24,0,0,1,168,136a8,8,0,0,0-16,0,24,24,0,0,1-48,0,8,8,0,0,0-16,0,24,24,0,0,1-24.68,24C50.46,159.64,40,148.58,40,135.33Zm160,96H56a8,8,0,0,1-8-8V172.56A38.77,38.77,0,0,0,62.88,176a39.69,39.69,0,0,0,29-11.31A40.36,40.36,0,0,0,96,160a40,40,0,0,0,64,0,40.36,40.36,0,0,0,4.13,4.67A39.67,39.67,0,0,0,192,176c.38,0,.76,0,1.14,0A38.77,38.77,0,0,0,208,172.56V200A8,8,0,0,1,200,208Z'></path>
          </svg>
        </div>
        <h2 className='text-[#111418] text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center'>
          Happy Birthday, Billy
        </h2>
        <div className='flex w-12 items-center justify-end'>
          <div
            className='text-[#111418]'
            data-icon='BellSimple'
            data-size='24px'
            data-weight='regular'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24px'
              height='24px'
              fill='currentColor'
              viewBox='0 0 256 256'
            >
              <path d='M232,112a24,24,0,0,0-24-24H136V79a32.06,32.06,0,0,0,24-31c0-28-26.44-45.91-27.56-46.66a8,8,0,0,0-8.88,0C122.44,2.09,96,20,96,48a32.06,32.06,0,0,0,24,31v9H48a24,24,0,0,0-24,24v23.33a40.84,40.84,0,0,0,8,24.24V200a24,24,0,0,0,24,24H200a24,24,0,0,0,24-24V159.57a40.84,40.84,0,0,0,8-24.24ZM112,48c0-13.57,10-24.46,16-29.79,6,5.33,16,16.22,16,29.79a16,16,0,0,1-32,0ZM40,112a8,8,0,0,1,8-8H208a8,8,0,0,1,8,8v23.33c0,13.25-10.46,24.31-23.32,24.66A24,24,0,0,1,168,136a8,8,0,0,0-16,0,24,24,0,0,1-48,0,8,8,0,0,0-16,0,24,24,0,0,1-24.68,24C50.46,159.64,40,148.58,40,135.33Zm160,96H56a8,8,0,0,1-8-8V172.56A38.77,38.77,0,0,0,62.88,176a39.69,39.69,0,0,0,29-11.31A40.36,40.36,0,0,0,96,160a40,40,0,0,0,64,0,40.36,40.36,0,0,0,4.13,4.67A39.67,39.67,0,0,0,192,176c.38,0,.76,0,1.14,0A38.77,38.77,0,0,0,208,172.56V200A8,8,0,0,1,200,208Z'></path>
            </svg>
          </div>
        </div>
      </div>
      <div className='@container h-1/2'>
        <div className='@[80px]:p-4'>
          <animated.div
            className='flex min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat @[480px]:gap-8 @[480px]:rounded-xl items-center justify-start p-4 will-change-opacity'
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%), url("${process.env.PUBLIC_URL}/images/billy${image}.jpg")`,
            }}
          >
            <div className='flex flex-col gap-2 text-center'>
              <h1
                className='text-white text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-5xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em]'
                style={{fontFamily: 'Acme'}}
              >
                It's
                <span style={{color: '#FCEE70'}}> Billy</span>'s Day
              </h1>
              <h2
                className='text-white text-sm font-normal leading-normal @[480px]:text-base @[480px]:font-normal @[480px]:leading-normal'
                style={{fontFamily: 'Libre Baskerville'}}
              >
                "I don't suffer from shyness,
                <br /> I'm just hoding back my awesomeness <br />
                so I don't intimidate you."
              </h2>
            </div>
          </animated.div>
        </div>
      </div>
      <div className='items-center justify-center flex flex-col h-1/2'>
      {isAlert && <div className='flex absolute justify-center'><Alert type={alertType}/></div>}
        <p className='text-[#111418] text-base font-normal leading-normal pb-3 pt-1 px-4 '>
          <p style={{fontSize: '10px'}}>
            @welovebilly ⭐⭐⭐⭐⭐ 9 months ago <br />
            Kind | Gentle | Smart <br />
            very kind, good listener. Highly recommend to meet in person!
          </p>
          <br />
          <p style={{fontSize: '10px'}}>
            @exgirlfriend ⭐⭐⭐⭐⭐ 20 days ago <br />
            Green flag | Hubby material | Good driver
            <br />
            Greenest flag I've ever met.
          </p>
          <br />
          <br />
          <p className='text-center' style={{fontSize: '19px', fontWeight: 'bold'}}>
            ! Last chance to be a Billy-onaire !
          </p>
          <p style={{fontSize: '14px'}} className='text-center'>
            Fill out the form, If you are interested in
          </p>
        </p>
        <div className='flex max-w-[480px] flex-1 flex-wrap items-end gap-4 px-4 py-3'>
          <label className='flex flex-col w-full flex-1'>
            <input
              placeholder='Intro yourself'
              className='form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#111418] focus:outline-0 focus:ring-0 border-none bg-[#f0f2f4] focus:border-none h-14 placeholder:text-[#637588] p-4 text-base font-normal leading-normal'
              value={intro}
              onChange={handleIntro}
            />
          </label>
        </div>
        <div className='flex max-w-[480px] flex-1 flex-wrap items-end gap-4 px-4 py-3'>
          <label className='flex flex-col min-w-40 flex-1'>
            <input
              placeholder='Your name'
              className='form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#111418] focus:outline-0 focus:ring-0 border-none bg-[#f0f2f4] focus:border-none h-14 placeholder:text-[#637588] p-4 text-base font-normal leading-normal'
              value={name}
              onChange={handleName}
            />
          </label>
        </div>
        <div className='flex w-10/12 flex-1 flex-row content-around justify-center gap-4 px-4 py-3'>
            <p className='flex items-center justify-center text-black font-bold'>+</p>
            <input
              type='tel'
              placeholder='1'
              pattern="[0-9]{1}"
              className='form-input w-1/6 overflow-hidden rounded-xl text-[#111418] focus:outline-0 focus:ring-0 bg-[#f0f2f4] border-none h-5 placeholder:text-[#637588] p-4 text-base font-normal text-sm leading-normal'
              value={firstphone}
              maxLength={1}
              onChange={e => handlePhone(1, e)}
            />
            <input
              type='tel'
              pattern="[0-9]{3}"
              placeholder='777'
              className='form-input w-1/4 resize-none overflow-hidden rounded-xl text-[#111418] focus:outline-0 focus:ring-0 bg-[#f0f2f4] border-none h-5 placeholder:text-[#637588] p-4 text-base font-normal text-xs leading-normal'
              value={secondphone}
              maxLength={3}
              onChange={e => handlePhone(2, e)}
            />
            <input
              type='tel'
              pattern="[0-9]{3}"
              placeholder='888'
              className='form-input w-1/4 resize-none overflow-hidden rounded-xl text-[#111418] focus:outline-0 focus:ring-0 bg-[#f0f2f4] border-none h-5 placeholder:text-[#637588] p-4 text-base font-normal text-xs leading-normal'
              value={thirdphone}
              maxLength={3}
              onChange={e => handlePhone(3, e)}
            />
            <input
              type='tel'
              pattern="[0-9]{4}"
              placeholder='9999'
              className='form-input w-1/3 resize-none overflow-hidden rounded-xl text-[#111418] focus:outline-0 focus:ring-0 bg-[#f0f2f4] border-none h-5 placeholder:text-[#637588] p-4 text-base font-normal text-xs leading-normal'
              value={fourthphone}
              maxLength={4}
              onChange={e => handlePhone(4, e)}
            />
        </div>
        <div className='flex px-4 py-3'>
          <button
            className={`flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 flex-1 text-white text-sm font-bold leading-normal tracking-[0.015em] ${
              checkValidation()
                ? 'bg-[#1980e6] active:opacity-50'
                : 'bg-gray-500 cursor-not-allowed'
            }`}
            style={{backgroundColor: checkValidation() ? '#1980e6' : 'gray'}}
            disabled={!checkValidation()}
            onClick={sendMessage}
          >
            <span className='truncate'>Like</span>
          </button>
        </div>
      </div>
      <div>
        <div className='flex justify-end overflow-hidden px-7 pb-5'>
        </div>
      </div>
    </div>
    </>
  )
}

export default App
