import React, { Component } from 'react';
import { render } from 'react-dom';
import AwesomeButton from './index';

class Demo extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <section>
  			<h1>React Components are awesome</h1>
  			<p>The <strong>Awesome Button Vanilla JS Custom Element</strong> is a cool option to quickly add<br/> share buttons (or any kind of buttons) to your projects.</p>
  			<h2>
  				<strong>&lt;AwesomeButton/&gt;</strong>
  				<span>~1KB compressed</span>
  			</h2>
  			<img className='support' src="/images/support.svg" alt="Modern Browsers" title="Modern Browsers" />
  			<ul className="examples">
  				<li>
  					<div className="code">
  						<span>&lt;AwesomeButton</span><br/><em>type</em>=<b>"primary"</b><span>&gt;</span>Primary Button<span>&lt;/AwesomeButton&gt;</span>
  					</div>
  					<AwesomeButton type="primary">Primary Button</AwesomeButton>
  				</li>
          <li>
  					<div className="code">
  						<span>&lt;AwesomeButton</span><br/><em>action</em>=<b>"onClickAction"</b><br/><em>type</em>=<b>"primary"</b><br/><em>progress</em><span>&gt;</span>Progress Button<span>&lt;/AwesomeButton&gt;</span>
  					</div>
  					<AwesomeButton
              type="primary"
              action={(callback) => {
                setTimeout(() => {
                  callback();
                },1000)
              }}
              progress>Progress Button</AwesomeButton>
  				</li>
  			</ul>
  			<footer>
  				<small>Star and support this project on <a target="_blank" href="https://github.com/rcaferati/awesome-button">github</a>.</small>
  				<small>Read more and discuss at the <a target="_blank" href="//caferati.me/labs/awesome-button">article page</a>.</small>
  			</footer>
      </section>);
  }
}

render(<Demo />, document.getElementById('root'));
