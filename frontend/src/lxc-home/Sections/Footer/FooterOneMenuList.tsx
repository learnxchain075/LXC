
// import menuData from '../../assets/data/Footer/FooterOneData';

import menuData from "../../assets/data/footer/FooterOneData";

const FooterOneMenuList = () => {
    return (
        <div className="footer-one-menu-list">
            <div className="row">
                {menuData.map((column, colIdx) => (
                    <div key={colIdx} className={`col-md-4 ${column.col}`}>
                        <div className={`footer1menu-list-col ${column.parentClass}`}>
                            {column.items.map((menu, menuIdx) => (
                                <aside key={menuIdx} className="footer-widget">
                                    {menu.title && (
                                        <div className="widget-title">
                                            <h6>{menu.title}</h6>
                                        </div>
                                    )}
                                    <div className="widget-body">
                                        <ul className="widget-list">
                                            {menu.items.map((item, itemIdx) => (
                                                <li key={itemIdx}>
                                                    {item.label && (
                                                        <a href={item.href || '#'}>{item.label}</a>
                                                    )}
                                                    {item.subItems && (
                                                        <ol className={item.label === null ? 'label-none' : ''}>
                                                            {item.subItems.map((subItem, subIdx) => (
                                                                <li key={subIdx}>
                                                                    <a href={subItem.href}>{subItem.label}</a>
                                                                    {subItem.badge && (
                                                                        <span className="template-badge">{subItem.badge}</span>
                                                                    )}
                                                                </li>
                                                            ))}
                                                        </ol>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </aside>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FooterOneMenuList;
