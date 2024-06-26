import React from 'react'
import './footer.scss'

export const Footer = () => {
  return (
    <>
   <footer>
    <div className="footer-container container" >
      <div className="content_1">
        <img src="/sudhir-logo.png" alt="logo"  width='60px' height='60px' style={{borderRadius:'50%',border:'1px solid pink'}}/>
        <p>The customer is at the heart of our <br />
              unique business model, which includes <br />
              design.</p>
              <img src="https://i.postimg.cc/Nj9dgJ98/cards.png" alt="" />
      </div>
      <div className="content_2">
            <h4>SHOPPING</h4>
            <a href="#">Clothing Store</a>
            <a href="#">Trending Shoes</a>
            <a href="#">Accessories</a>
            <a href="#">Sale</a>
          </div>
          <div className="content_3">
            <h4>SHOPPING</h4>
            <a href="#">Contact Us</a>
            <a href="#">Payment Methods</a>
            <a href="#">Delivery</a>
            <a href="#">Return and Exchange</a>
          </div>
          <div className="content_4">
            <h4>NEWLETTER</h4>
            <p>Be the first to know about new <br />
              arrivals, look books, sales & promos!</p>
            <div className="f-mail">
              <input type="email" name="" id="" placeholder='Your Email' />
            </div>
          </div>
    </div>
    <div className="f-design">
          <div className="f-design-txt container">
            <p>Design and Code By Sudhir Kumar</p>
          </div>
        </div>
    
   </footer>
   </>
  )
}
