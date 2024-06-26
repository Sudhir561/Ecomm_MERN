import React,{useState} from 'react'
import Dropdown from 'react-bootstrap/Dropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import './header.scss'
export const Header = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <>
    <header>
    <div className="container">
      <nav>
        <div className="left">
          <div className="navlogo">
            <a href="">
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvHHPF7x1PpyYkLIWsIi4bx8KNMvM0ukd2-uiuETxXBNT1gDw4_Fw-W6ytfmon-MpIGew&usqp=CAU" 
              alt="fashion-logo" width='120px' height='70px'/>
            </a>
          </div>
        </div>
        <div className="right">
        <div className="hamburgur" onClick={handleShow}>
        <i class="fa fa-bars"></i>
        </div>
          <div className="nav_btn">
            <a href="">Products</a>
          </div>
          <div id='ex4' className="cartsicon">
            <a className='text-dark' href="">
              <span className='p1 fa-stack fa-2x has-badge' data-count={0}>
              <i class=" p1 fa-solid fa-cart-shopping"></i>
              </span>
            </a>
          </div>
          <div className="profile">
          <Dropdown className='text-center'>
      <Dropdown.Toggle className='dropdown_btn' id="dropdown-basic">
       <img src="/profile-image.png" alt="" width='40px'  className='profile_img'/>
      </Dropdown.Toggle>

      <Dropdown.Menu className='dropdown-menu'>
        <Dropdown.Item className='dropdown-item'    href="#/action-1">
          <a href="" className='text-dark'>
          <i class="fa-solid fa-user"></i>&nbsp;&nbsp;&nbsp;
            Profile
          </a>
        </Dropdown.Item>

        <Dropdown.Item href="#/action-2">
          <a href="" className='text-dark'>
          <i class="fa-solid fa-user"></i>&nbsp;&nbsp;&nbsp;
            Login
          </a>
        </Dropdown.Item>
        
      </Dropdown.Menu>
    </Dropdown>
          </div>
        </div>
      </nav>
    </div>

    <Offcanvas  show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
        <img src="/profile-image.png" alt="" width='40px'  className='profile_img'/>
        </Offcanvas.Header>
        <Offcanvas.Body style={{background:'black',color:'white'}}>
        <a style={{textDecoration:'none', color:'white'}} href=""> <i class="fa-solid fa-shop">&nbsp;&nbsp;&nbsp;</i>Products</a> <br /> <br/>

        <a style={{textDecoration:'none', color:'white'}} href=""> <i class="fa-solid fa-circle-arrow-right">&nbsp;&nbsp;&nbsp;</i>Login</a> <br />
        <div id='ex4' className="cartsicon">
            <a className='text-light' href="">
              <span className='p1 fa-stack fa-2x has-badge' data-count={0}>
              <i class=" p1 fa-solid fa-cart-shopping"></i>
              </span>
            </a>
          </div>
        </Offcanvas.Body>
      </Offcanvas>

    </header>

    
    </>
  )
}
