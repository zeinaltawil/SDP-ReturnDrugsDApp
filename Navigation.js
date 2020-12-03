import React from 'react';
import { Button } from 'reactstrap'; 
import { NavLink } from 'react-router-dom';
 
const Navigation = () => {
    return (
       <div>
          <NavLink to="/"> <button class="barButtonsnav" type="submit"> Home  </button> </NavLink>
          <NavLink to="./FDA"> <button  class="barButtonsnav" type="submit"> FDA </button> </NavLink>
          <NavLink to="./Manufacturers"> <button class="barButtonsnav" type="submit"> Manufacturers </button> </NavLink>
          <NavLink to="./Sellers"> <button  class="barButtonsnav" type="submit"> Sellers </button> </NavLink>
          <NavLink to="./CA"> <button class="barButtonsnav" type="submit"> CA </button> </NavLink>
          <NavLink to="./Reseller"> <button  class="barButtonsnav" type="submit"> Reseller </button> </NavLink>
          <NavLink to="./Patients"> <button class="barButtonsnav" type="submit"> Patients </button> </NavLink>

       </div>
    );
}
 
export default Navigation;