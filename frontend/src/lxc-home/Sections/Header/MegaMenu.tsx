import { useEffect } from "react";
import Data from "../../assets/data/header/megaMenu";
import { NavLink } from "react-router-dom";

const MegaMenu = ({ megaMenuClass }) => {
  useEffect(() => {
    /*-- Mega menu scripts start --*/
    const homeNav = document.querySelector(".home-nav");

    if (homeNav) {
      const megaTabLinks = document.querySelectorAll(".megaTablinks");
      const megaMenuTab = document.querySelector(".mega-menu-tabcontent");
      const megaMenuTabContent = document.querySelectorAll(
        ".megaMenutabcontent"
      );

      function allDisplayNone() {
        megaMenuTabContent.forEach((item) => {
          item.style.display = "none";
        });
      }

      function onlyDisplayBlock(idName) {
        const item = megaMenuTab.querySelector(`#${idName}`);
        item.style.display = "block";
      }

      function defaultDisplay() {
        const item = megaMenuTab.querySelector("#primaryText");
        item.style.display = "block";
      }

      megaTabLinks.forEach((item) => {
        const menuData = item.getAttribute("data-menu");
        item.addEventListener("mouseover", () => {
          item.classList.add("menuTabActive");
          allDisplayNone();
          onlyDisplayBlock(menuData);
        });
        item.addEventListener("mouseout", () => {
          item.classList.remove("menuTabActive");
          allDisplayNone();
          defaultDisplay();
        });
      });
    }
    /*-- Mega menu scripts end --*/
  }, []);

  return (
    <div className="mega-menu">
      <div className={`mega-menu-card ${megaMenuClass}`}>
        {Data?.map((columnItem, cid) => (
          <div key={cid} className="mega-menu-column">
            {columnItem.menuList && (
              <ul className="mega-menu-list">
                {columnItem.menuList?.map((menuItem, mid) => (
                  <li
                    key={mid}
                    className="megaTablinks"
                    data-menu={menuItem.dataMenu}
                  >
                    <NavLink to={menuItem.url}>{menuItem.title}</NavLink>
                    {menuItem.tag && (
                      <div className={`tag ${menuItem.tag}`}>
                        {menuItem.tag}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}

            {columnItem.demoCard && (
              <div className="more-demo-card">
                <p>{columnItem.demoCard.title}</p>
                <p>{columnItem.demoCard.title2}</p>
                <img src={columnItem.demoCard.img} alt="img" />
              </div>
            )}

            {columnItem.demoImgList && (
              <div className="mega-menu-tabcontent">
                <div id="primaryText" className="megaMenutabcontent">
                  <h5 className="wt-700 mt-3">
                    37 HTML Pages with trendy design
                  </h5>
                </div>

                {columnItem.demoImgList?.map((demoImgItem, did) => (
                  <div
                    key={did}
                    id={demoImgItem.dataMenu}
                    className="megaMenutabcontent"
                  >
                    <div className="mega-menu-img">
                      <img src={demoImgItem.img} alt="" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MegaMenu;
