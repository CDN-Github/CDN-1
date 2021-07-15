/**
 * Copyright (c) 2018-2020 aetheryx & Bowser65
 * All Rights Reserved. Licensed under the Porkord License
 * https://powercord.dev/porkord-license
 */

const { gotoOrJoinServer } = require('powercord/util');
const { Clickable, Tooltip, Icons: { badges: BadgeIcons } } = require('powercord/components');
const { React, getModule } = require('powercord/webpack');

const Base = React.memo(({ color, tooltip, tooltipPosition, onClick, className, children }) => {
  const { profileBadge22 } = getModule([ 'profileBadge22' ], false);
  return (
    <Clickable onClick={onClick || (() => void 0)} className='powercord-badge-wrapper'>
      <Tooltip text={tooltip} position={tooltipPosition || 'top' } spacing={24}>
        <div className={`${profileBadge22} powercord-badge ${className}`} style={{ color: `#${color || '7289da'}` }}>
          {children}
        </div>
      </Tooltip>
    </Clickable>
  );
});

const Custom = React.memo(({ name, icon, tooltipPosition }) => (
  <Base
    tooltipPosition={tooltipPosition}
    onClick={() => {}}
    className='powercord-badge-cutie'
    tooltip={name}
  >
    <img src={icon} alt='Custom badge'/>
  </Base>
));

const Staff = React.memo(({ color }) => (
  <Base
    onClick={() => gotoOrJoinServer(`https://discord.gg/AjKJSBbGm2`)}
    className='powercord-badge-staff'
    tooltip='Garlic-Team Staff'
    color={color}
  >

    <BadgeIcons.Staff/>
  </Base>
));

module.exports = {
  Custom,
  Staff
};
