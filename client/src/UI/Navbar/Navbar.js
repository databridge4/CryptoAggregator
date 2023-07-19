import React, {Fragment, useState} from 'react';
import {Link, Outlet, useLocation} from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const [open, setOpen] = useState(false);
    const location = useLocation();

    const handleClick = () => {
        setOpen(!open);
    };

    const closeMenu = () => {
        setOpen(false);
    };

    return (
        <Fragment>
            <nav className="navbar">
                <div className="navbar__logo" onClick={handleClick}>
                    Trades
                </div>
                <div className={`navbar__links ${open ? 'open' : ''}`}>
                    <Link to="/" className={`navbar__link ${location.pathname === "/" ? "active" : ""}`} onClick={closeMenu}>Book</Link>
                    <Link to="/orders" className={`navbar__link ${location.pathname === "/orders" ? "active" : ""}`} onClick={closeMenu}>Orders</Link>
                    <Link to="/ArchiveBook" className={`navbar__link ${location.pathname === "/ArchiveBook" ? "active" : ""}`} onClick={closeMenu}>Archive Book</Link>
                    <Link to="/ArchiveOrders" className={`navbar__link ${location.pathname === "/ArchiveOrders" ? "active" : ""}`} onClick={closeMenu}>Archive Orders</Link>
                    <Link to="/DeleteArchive" className={`navbar__link ${location.pathname === "/DeleteArchive" ? "active" : ""}`} onClick={closeMenu}>Clear DB</Link>
                </div>
            </nav>
            <div className={'margin'} onClick={closeMenu}>
                <Outlet/>
            </div>
        </Fragment>

    );
};

export default Navbar;
