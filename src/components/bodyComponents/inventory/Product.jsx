import { Avatar, Typography } from "@mui/material";
import React from "react";

export default function Product({ product }) {
  return (
    <>
      <Avatar
        alt={product.name}
        // src="image/source"
        sx={{ width: 30, height: 30 }}
      >
        {product.name.charAt(0)}
      </Avatar>

      <Typography sx={{ mx: 3 }} variant="subtitle2">
        {product.name}
      </Typography>
    </>
  );
}