﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Solvberget.Domain.DTO
{
    public class UserInfo
    {

        public bool IsAuthorized { get; set; }


        public bool Authenticate (string userId, string verification )
        {



            return IsAuthorized;
        }

    }
}
