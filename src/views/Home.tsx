import buttonClickSound from '../assets/button-click-sound.mp3'
import { HomeProps, gamepad } from '../utils/types'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import backgroundMusic from '../assets/game.mp3'
import valuehero from '../assets/valuehero.png'
import AudioComponent from '../components/Audio'
import { addHandleGamePad, isDownPressed, isUpPressed, removeHandleGamePad } from '../utils/gamepad'

const Home: React.FC<HomeProps> = ({ }) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const navigate = useNavigate()

  const goToGame = (): void => {
    playSound()
    navigate('/game')
  }

  const goToHighscore = (): void => {
    playSound()
    navigate('/scores')
  }

  const playSound = () => {
    const audio = new Audio(buttonClickSound)
    audio.play()
  }

  const handlePress = () => {
    switch (activeIndex) {
      case 0:
        goToGame()
        break
      case 1:
        goToHighscore()
        break
      default:
        break
    }
  }

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      event.preventDefault()
      event.stopPropagation()
      console.log('key', event.key, 'code', event.keyCode)

      switch (event.key) {
        case 'ArrowUp':
          setActiveIndex((prev) => (prev + 1) % 2)
          break
        case 'ArrowDown':
          setActiveIndex((prev) => (prev + 1) % 2)
          break
        case ' ':
          handlePress()
          break
        default:
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)

    const gamePadHandler = addHandleGamePad((input: gamepad) => {
      if (input.type === 'button' && input.pressed) {
        handlePress();
        return;
      }

      if (isDownPressed(input)) {
        setActiveIndex((prev) => (prev + 1) % 2)
      }

      if (isUpPressed(input)) {
        setActiveIndex((prev) => (prev + 1) % 2)
      }
    });

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      removeHandleGamePad(gamePadHandler);
    }
  }, [activeIndex])

  return (
    <>

      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content text-center">
          <div className="">
            <div className="title-wrapper mb-8 floating">
              <div className="fixed w-full hero-img mb-20">
                <img className="w-2/4 max-w-96 opacity-75" src={valuehero} />
              </div>
              <h1 className="sweet-title sweet-title-mixed">
                <span data-text="#ValueHero">#ValueHero</span>
              </h1>
            </div>

            <div className="flex flex-col gap-4">
              <button
                className={(activeIndex === 0 ? 'active' : '') + ' kave-btn'}
              >
                <span className="kave-line"></span>
                Starten!
              </button>

              <button
                className={(activeIndex === 1 ? 'active' : '') + ' kave-btn'}
              >
                <span className="kave-line"></span>
                Highscore
              </button>
            </div>
          </div>
        </div>
        <AudioComponent
          onAudioEnd={() => { }}
          path={backgroundMusic}
          volume={0.005}
        />
      </div>
    </>
  )
}

export default Home
