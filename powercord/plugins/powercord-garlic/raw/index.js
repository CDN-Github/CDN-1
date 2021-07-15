async function startPlugin() {
  await this.injectUsers();
  await this.injectGuilds();

  const styleId = loadStyle(join(__dirname, 'style.css'));
  unloadStyle(styleId);

  const containerClasses = getModule([ 'subscribeTooltipText' ], false);
  const modalClasses = getModule([ 'topSectionNormal' ], false);
  if (containerClasses) {
    forceUpdateElement(`.${containerClasses.container}`);
  }
  if (modalClasses) {
    const modalHeader = document.querySelector(`.${modalClasses.topSectionNormal} header`);
    if (modalHeader) {
      const instance = getOwnerInstance(modalHeader);
      (instance._reactInternals || instance._reactInternalFiber).return.stateNode.forceUpdate();
    }
  }
}

async function injectUsers () {
  const UserProfileBadgeList = await getModule((m) => m.default?.displayName === 'UserProfileBadgeList');
  inject('pc-gbadges-users', UserProfileBadgeList, 'default', ([ props ], res) => {
    const [ badges, setBadges ] = React.useState(null);
    React.useState(() => {
      get(`https://gapi.rgarlic.repl.co/v1/discord/user/${props.user.id}/badges?json`).then(res => {
        setBadges(res.body.badges)
    });
    }, []);

    if (!badges) {
      return res;
    }

    const render = (Component, key, props = {}) => (
      React.createElement(Component, {
        key: `pc-${key}`,
        color: badges.custom && badges.custom.color,
        ...props
      })
    );

    if (badges.custom && badges.custom.name && badges.custom.icon) res.props.children.push(render(Badges.Custom, 'cutie', badges.custom));
    if (badges.staff) res.props.children.push(render(Badges.Staff, 'staff'));

    return res;
  });

  UserProfileBadgeList.default.displayName = 'UserProfileBadgeList';
}

async function injectGuilds () {
  const GuildHeader = await getModuleByDisplayName('GuildHeader');
  const GuildBadge = await getModuleByDisplayName('GuildBadge');

  inject('pc-gbadges-guilds-header', GuildHeader.prototype, 'renderHeader', function (_, res) {
    if (cache._guilds[this.props.guild.id]) {
      res.props.children.unshift(
        React.createElement(Badges.Custom, {
          ...cache._guilds[this.props.guild.id],
          tooltipPosition: 'bottom'
        })
      );
    }
    return res;
  });

  inject('pc-gbadges-guilds-tooltip', GuildBadge.prototype, 'render', function (_, res) {
    if (this.props.size && cache._guilds[this.props.guild.id]) {
      return [
        React.createElement(Badges.Custom, {
          ...cache._guilds[this.props.guild.id],
          tooltipPosition: 'bottom'
        }),
        res
      ];
    }
    return res;
  });

  get(`https://gapi.rgarlic.repl.co/v1/discord/guilds/badges?json`).then(async res => {
    cache._guilds = res.body;
    const { container } = await getModule([ 'subscribeTooltipText' ]);
    forceUpdateElement(`.${container}`);
  });
}

module.exports = startPlugin;
module.exports = injectUsers;
module.exports = injectGuilds;
