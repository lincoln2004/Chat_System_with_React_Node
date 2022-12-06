import styled from 'styled-components'



let CustomSelect = styled.div`

width: 30%; height 3rem; margin: 0 1rem;

border-radius: 8px; background: rgb(250, 183, 105);

border: none; outline: none;

color: black; text-align: center;

line-height: 3rem; font-size: 14pt;

position: relative; left: 0; 

display: flex; align-items: center;

flex-direction: column;

&::after {

    content: ' '; width: 0.7rem; 

    height: 0.7rem; transform: ${({ active }) =>  active ? 'rotate(-135deg)': 'rotate(45deg)'};

    border-bottom: 0.1rem solid white;

    border-right: 0.1rem solid white;

    position: absolute;  right: 0.5rem; top: ${({ active }) =>  active ? '1.25rem': '1rem'};

    cursor: pointer; user-select: none;
}

& #selectMenu {

    width: 100%; height: 100%;

    border-radius: 8px; user-select: none;

    background: transparent; cursor: pointer;

    color: white; position: relative; text-align: center;

    margin: 0.7rem 0 1rem 0;
}

& #selectMenu::selection {

    background: none;
}


& .option_card {

    width: 100%; height: 100%;

    margin: 0.3rem 0; display: ${({ active }) =>  active ? 'block': 'none'};

    box-shadow: 0 0 1rem rgba(0, 0, 0, 0.4); 

    user-select: none; transition: 0.3s;

    background: rgb(250, 183, 105); border-radius: 8px;
}

& .option_card:hover {

   background: white; cursor: pointer;

   color: black;
}

`


export { CustomSelect }