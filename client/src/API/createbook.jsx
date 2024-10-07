import axios from "axios";
import { store } from "./../store/store";
import * as bookactions from "./../store/actions/bookinfoactions";
import { ToLink } from "../App";

export const createbook = async (bookinfo) =>{
    // console.log(bookinfo)
    const chaptersObject = bookinfo.reduce((acc, chapter, index) => {
        acc[`chapter${index + 1}`] = chapter;
        return acc;
      }, {});
      console.log(chaptersObject)
}