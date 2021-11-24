
import PropTypes from 'prop-types';
import styles from './menu.scss';
import { arc, pie } from 'd3-shape';
import { filterChildren } from 'common/children';
import useChildren from 'common/hooks/useChildren';
import { useTween } from 'common/hooks/useTimers';
import { easeOutElastic, easeOutQuart } from 'common/easing';
import useMediaQuery from 'common/hooks/useMediaQuery';
import { cl } from '@twipped/utils';

// eslint-disable-next-line no-unused-vars
export function MenuItem ({ title, href, icon, ratio }) {
  throw new Error('MenuItem should not have rendered');
}
MenuItem.propTypes = {
  title: PropTypes.string,
  href: PropTypes.string,
  icon: PropTypes.node,
  ratio: PropTypes.number,
};

export default function Menu ({ center: centerImage, radius = 280, children }) {

  const items = useChildren(children, () => filterChildren(children, { type: MenuItem }).map((c) => c.props));
  const wide = useMediaQuery('(min-width: 680px)');

  return (
    <nav
      className={cl(
        styles.menu,
        wide ? styles.arc : styles.list,
      )}
    >
      <div className={styles.center}>
        <h1 className={styles.caption}>Jocelyn Badgley</h1>
        {centerImage}
        <h2 className={styles.subcaption}>Twipped Media</h2>
      </div>

      {wide ? (
        <MenuArc items={items} radius={radius} />
      ) : (
        <MenuList items={items} />
      )}
    </nav>
  );
}
Menu.propTypes = {
  center: PropTypes.node,
  radius: PropTypes.number,
};
Menu.Item = MenuItem;

function MenuList ({ items }) {
  return items.map((item, index) => (
    <div
      key={index}
      className={cl(
        styles.item,
        !index && items.length % 2 && styles.odd,
      )}
      style={{
        color: item.color,
      }}
    >
      <a
        title={item.title}
        href={item.href}
      >{item.icon}</a>
    </div>
  ));
}
MenuList.propTypes = { items: PropTypes.arrayOf(PropTypes.object) };


function MenuArc ({ items: _items, radius }) {
  const tween = useTween(true, 1000, 50);

  _items = [ ..._items ];
  const items = [];
  while (_items.length) {
    if (_items.length % 2) items.push(_items.shift());
    else items.unshift(_items.shift());
  }

  const circ = Math.PI * 0.5;
  const tweenedRadius = (radius * 0.5) + (radius * 0.5 * easeOutElastic(tween));
  const tweenedFont = 10 + (40 * easeOutElastic(tween));
  const tweenedSpin = (circ * easeOutQuart(tween)) - circ;

  const arcs = pie().value(({ ratio = 1 }) => ratio)(items);
  const children = arcs.map(({ startAngle, endAngle, data: item, index }) => {
    const [ x, y ] = arc()
      .outerRadius(tweenedRadius)
      .innerRadius(tweenedRadius - 1)
      .startAngle(startAngle + tweenedSpin - (Math.PI * 2))
      .endAngle(endAngle)
      .centroid();

    return (
      <div
        key={index}
        className={styles.item}
        style={{
          transform: `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px)`,
          color: item.color,
          fontSize: `${tweenedFont}px`,
        }}
      >
        <a
          title={item.title}
          href={item.href}
        >{item.icon}</a>
      </div>
    );
  });

  children.unshift(
    <div
      key={children.length}
      className={styles.ring}
      style={{
        fontSize: `${radius * tween}px`,
      }}
    >
      <a />
    </div>,
  );

  return children;
}
MenuArc.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object),
  radius: PropTypes.number,
};
