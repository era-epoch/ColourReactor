import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CSS from 'csstype';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import uuid from 'react-uuid';
import { setActiveDialogue, setColorScheme } from '../../State/Slices/appSlice';
import { RootState } from '../../State/rootReducer';
import { defaultPopupStyle } from '../../Styles/ComponentStyles';
import { ColorScheme, Dialogue } from '../../types';
import PopoutShape from '../PopoutShape';

interface Props {}

const EpilepsyWarning = (props: Props): JSX.Element => {
  const dispatch = useDispatch();
  const colorScheme = useSelector((state: RootState) => state.app.colorScheme);
  const allColorSchemes = useSelector((state: RootState) => state.app.availableColorSchemes);
  const activeDialogue = useSelector((state: RootState) => state.app.activeDialogue);
  const shown = activeDialogue === Dialogue.epilepsyWarning;

  const initShapePositionOffset = 12;
  const fadeOutDuration = 2000;

  const [shapePositionOffset, setShapePositionOffset] = useState(initShapePositionOffset);
  const [hiding, setHiding] = useState(false);

  const buttonMouseEnter = () => {
    setShapePositionOffset(30);
  };
  const buttonMouseLeave = () => {
    if (!hiding) {
      setShapePositionOffset(initShapePositionOffset);
    }
  };
  const accept = () => {
    setHiding(true);
    setTimeout(() => {
      dispatch(setActiveDialogue(Dialogue.none));
    }, fadeOutDuration);
  };
  const buttonMouseDown = () => {
    setShapePositionOffset(5);
  };
  const buttonMouseUp = () => {
    setShapePositionOffset(100);
  };

  const lowerPopupStyles: CSS.Properties[] = [];
  const upperPopupStyles: CSS.Properties[] = [];
  for (let i = 0; i < colorScheme.colors.length; i++) {
    const newLowerStyle: CSS.Properties = { ...defaultPopupStyle };
    newLowerStyle.backgroundColor = colorScheme.colors[i];
    newLowerStyle.left = `${(i + 1) * shapePositionOffset}px`;
    newLowerStyle.top = `${(i + 1) * shapePositionOffset}px`;
    newLowerStyle.zIndex = `-${i + 1}`;
    newLowerStyle.opacity = `${1 - 0.05 * (i * (i / 2) + 1)}`;
    newLowerStyle.transitionDuration = `${(i + 1) * 100}ms`;
    lowerPopupStyles.push(newLowerStyle);

    const newUpperStyle: CSS.Properties = { ...defaultPopupStyle };
    newUpperStyle.backgroundColor = colorScheme.colors[i];
    newUpperStyle.left = `${-1 * (i + 1) * shapePositionOffset}px`;
    newUpperStyle.top = `${-1 * (i + 1) * shapePositionOffset}px`;
    newUpperStyle.zIndex = `-${i + 1}`;
    newUpperStyle.opacity = `${1 - 0.05 * (i * (i / 2) + 1)}`;
    newUpperStyle.transitionDuration = `${(i + 1) * 100}ms`;
    upperPopupStyles.push(newUpperStyle);
  }

  const siteTitle: string = 'COLOUR REACTOR';
  const siteTitleArray = [];
  for (const c of siteTitle) {
    siteTitleArray.push(c);
  }

  const handleColorSchemeSelectChange = (selectedValue: ColorScheme | null) => {
    if (selectedValue) dispatch(setColorScheme(selectedValue));
  };

  return (
    <div
      className={`EpilepsyWarning dialogue ${hiding ? 'fade-out' : ''} ${shown ? '' : 'nodisplay'}`}
      style={{ '--fade-duration': `${fadeOutDuration}ms` } as React.CSSProperties}
    >
      <div className="dialogue-internal">
        <div className="dialogue-content">
          <div className="landing-title">
            {siteTitleArray.map((c, i) => {
              return (
                <div
                  className="site-title-char"
                  key={uuid()}
                  style={{ color: colorScheme.colors[i % colorScheme.colors.length] }}
                >
                  {c}
                </div>
              );
            })}
          </div>
          <div className="dialogue-subtitle">Select a colour palette ...</div>
          <div className="dialogue-section" onMouseEnter={buttonMouseEnter} onMouseLeave={buttonMouseLeave}>
            <Select
              options={allColorSchemes}
              getOptionLabel={(scheme: ColorScheme) => scheme.name}
              getOptionValue={(scheme: ColorScheme) => scheme.id}
              onChange={handleColorSchemeSelectChange}
            />
          </div>
          <div className="warning-title">WARNING: PHOTOSENSITIVITY/EPILEPSY SEIZURES</div>
          <div className="warning-blurb">
            This tool can create rapidly flashing and/or <b>strobing bright colours</b>, especially when the application
            speed is set to high. If you have an epileptic condition or suffer from seizures, please use caution as it
            may not be safe for you to use this tool.
          </div>
          <div className="warning-controls">
            <div className="warning-dont-show-again"></div>
            <div
              className="warning-accept ui-button round"
              onClick={accept}
              onMouseEnter={buttonMouseEnter}
              onMouseLeave={buttonMouseLeave}
              onMouseDown={buttonMouseDown}
              onMouseUp={buttonMouseUp}
            >
              <FontAwesomeIcon icon={faCheck} />
              {/* Continue */}
            </div>
          </div>
        </div>
        <div className="dialogue-popout-shapes">
          {colorScheme.colors.map((color, i) => {
            return <PopoutShape style={upperPopupStyles[i]} />;
          })}
          {colorScheme.colors.map((color, i) => {
            return <PopoutShape style={lowerPopupStyles[i]} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default EpilepsyWarning;