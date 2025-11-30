import { UsersModel } from "../Model/userModel.js";
import { gethashedPassword, comparePssword } from "../utils/hash.js";
import {
  getAccessToken,
  getCookiesPayload,
  getRefreshToken,
  verifyRefreshTOken,
} from "../utils/tokken.js";

export const UserRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log(name, email, password, "adas");

    if (!name || !email || !password) {
      return res.status(400).json({
        data: {
          msg: "name email and password are required",
        },
      });
    }
    const haveuser = await UsersModel.findOne({ email });
    if (haveuser) {
      return res.status(409).json({
        data: {
          msg: "user already found",
        },
      });
    }

    const hashedPassword = await gethashedPassword(password);
    console.log(hashedPassword, "hashedPassword");

    const newUser = await UsersModel.create({
      name,
      email,
      password: hashedPassword,
    });
    const payload = {
      userId: newUser._id,
      email: newUser.email,
    };
    console.log(payload, "payload");

    const accessToken = getAccessToken(payload);
    console.log(accessToken, "accessToken");

    const refreshToken = getRefreshToken({ userId: newUser._id });
    console.log(refreshToken, "refreshToken");

    const createCookies = getCookiesPayload();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await UsersModel.findByIdAndUpdate(newUser._id, {
      $push: {
        refreshToken: {
          token: refreshToken,
          expiresAt,
        },
      },
    });

    res.cookie("refreshtoken", refreshToken, createCookies);
    res.cookie("accessToken", accessToken, createCookies);
    res.status(201).json({
      msg: "user Registered sucessfully",
      status: 201,
    });
  } catch (error) {
    res.status(500).json({
      data: {
        error,
      },
    });
  }
};

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        data: {
          msg: "email and password is Missing",
        },
      });
    }
    const user = await UsersModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        data: {
          msg: "Wrong email and password",
        },
      });
    }
    const isPasswordMatched = await comparePssword(password, user?.password);
    if (!isPasswordMatched) {
      return res.status(401).json({
        data: {
          msg: "Wrong email and password",
        },
      });
    }
    const payload = {
      userId: user._id,
      email: user.email,
    };
    const accessToken = getAccessToken(payload);
    const refreshToken = getRefreshToken({ userId: user._id });
    const createCookies = getCookiesPayload();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await UsersModel.findByIdAndUpdate(user._id, {
      $push: {
        refreshToken: {
          token: refreshToken,
          expiresAt,
        },
      },
    });
    res.cookie("refreshtoken", refreshToken, createCookies);
    res.cookie("accessToken", accessToken, createCookies);
    res.status(201).json({
      msg: "user Login SucessFuly",
      data: user,
      status: 201,
    });
  } catch (error) {
    res.status(500).json({
      data: {
        error,
      },
    });
  }
};

export const refreshtoken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshtoken;
    console.log(refreshToken,"refreshToken");
    
    if (!refreshToken) {
      return res.status(500).json({
        data: {
          msg: "Login Again",
        },
      });
    }
    const isvalidToken = verifyRefreshTOken(refreshToken);
         console.log(isvalidToken,"isvalidToken");
    if (!isvalidToken) {
      return res.status(500).json({
        data: {
          msg: "Login Again",
        },
      });
    };
    const user = await UsersModel.findById(isvalidToken?.userId);
          console.log(user,"user");
    if (!user) {
      return res.status(500).json({
        data: {
          msg: "Login Again",
        },
      });
    };
    const getRefreshtokken = user?.refreshToken?.find(
      (t) => t?.token === refreshToken
    );
      console.log(getRefreshtokken,"getRefreshtokken");
    if (!getRefreshtokken) {
      return res.status(500).json({
        data: {
          msg: "Login Again",
        },
      });
    };
    if(new Date(getRefreshtokken.expiresAt) < new Date()){
            return res.status(500).json({
        data: {
          msg: "Login Again",
        },
      });
    }
       console.log("test");
    const payload = {
      userId: user._id,
      email: user.email,
    };
    console.log(payload,"payload");
    
    const accessToken = getAccessToken(payload);
    const createCookies = getCookiesPayload();
    
    res.cookie("accessToken", accessToken, createCookies);
    res.status(201).json({
      msg: "new accress token generated",
      data: user,
      status: 201,
    });
  } catch (error) {
    res.status(500).json({
      data: {
        msg: "error while genetate",
      },
    });
  }
};

export const logoutUser = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshtoken;
    if (!refreshToken) {
      res.clearCookie("refreshtoken")
      res.clearCookie("accesstoken")
      return res.status(500).json({
        data: {
          msg: "Login Again",
        },
      });
    }
    const isvalidToken = verifyRefreshTOken(refreshToken);
    if (!isvalidToken) {
       res.clearCookie("refreshtoken")
      res.clearCookie("accesstoken")
      return res.status(500).json({
        data: {
          msg: "Login Again",
        },
      });
    };
    let user = await UsersModel.findById(isvalidToken?.userId);
    if (!user) {
       res.clearCookie("refreshtoken")
      res.clearCookie("accesstoken")
      return res.status(500).json({
        data: {
          msg: "Login Again",
        },
      });
    };
    const getRefreshtokken = user?.refreshToken?.find(
      (t) => t?.token === refreshToken
    );
    if (!getRefreshtokken) {
       res.clearCookie("refreshtoken")
      res.clearCookie("accesstoken")
      return res.status(500).json({
        data: {
          msg: "Login Again",
        },
      });
    };
  user.refreshToken = user?.refreshToken?.filter(
      (t) => t?.token !== refreshToken
    );

    await user.save();
  res.clearCookie("refreshtoken")
      res.clearCookie("accesstoken")
    res.status(201).json({
      msg: "Logout User",
      data: user,
      status: 200,
    });
  } catch (error) {
    res.status(500).json({
      data: {
        msg: "error while genetate",
      },
    });
  }
};

export const logoutAllUser = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshtoken;
    if (!refreshToken) {
      res.clearCookie("refreshtoken")
      res.clearCookie("accesstoken")
      return res.status(500).json({
        data: {
          msg: "Login Again",
        },
      });
    }
    const isvalidToken = verifyRefreshTOken(refreshToken);
    if (!isvalidToken) {
       res.clearCookie("refreshtoken")
      res.clearCookie("accesstoken")
      return res.status(500).json({
        data: {
          msg: "Login Again",
        },
      });
    };
    let user = await UsersModel.findById(isvalidToken?.userId);
    if (!user) {
       res.clearCookie("refreshtoken")
      res.clearCookie("accesstoken")
      return res.status(500).json({
        data: {
          msg: "Login Again",
        },
      });
    };

  user.refreshToken = [];
    await user.save();
  res.clearCookie("refreshtoken")
      res.clearCookie("accesstoken")
    res.status(201).json({
      msg: "Logout from al devices User",
      data: user,
      status: 200,
    });
  } catch (error) {
    console.log(error,"qwrq");
    
    res.status(500).json({
      data: {
        msg: "error while genetate",
      },
    });
  }
};

export const getprotectedroutes = async (req , res)=>{
  try {
     const fetchusers = await UsersModel.find(); 
        res.status(200).json({
      data: {
        msg: "data users Sucessfully",
        users:fetchusers
      },
    });
  } catch (error) {
        res.status(500).json({
      data: {
        msg: "internam server error ",
      },
    });
  }
}