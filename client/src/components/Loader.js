import React, { useState } from 'react';
import HashLoader from "react-spinners/HashLoader";
import { css } from "@emotion/react";

function Loader() {
  let [loading, setLoading] = useState(true);
  let [color, setColor] = useState("#ffffff");
  
  const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
  `;

  return (
    <div>
      <div className="sweet-loading text-center">
        <HashLoader
          color='#000'
          loading={loading}
          css={override} // Use `css` instead of `cssOverride`
          size={80}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    </div>
  );
}

export default Loader;