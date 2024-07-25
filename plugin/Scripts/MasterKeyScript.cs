using BepInEx;
using Comfort.Common;
using EFT;
using EFT.Interactive;
using UnityEngine;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static LocationSettingsClass;

namespace configurable_keys.Scripts
{
    internal class MasterKeyScript
    {
        // Factory, Reserve, Shoreline, Customs, Woods, Interchange, Lighthouse, Streets, Ground-Zero, Labs
        private readonly string[] _keys = {
            "66a1c2502b6fdd6c620ba891",
            "66a1c8e951bcf7ade30f7943",
            "66a1c8e951bcf7ade30f7944",
            "66a1c8e951bcf7ade30f7945",
            "66a1c8e951bcf7ade30f7946",
            "66a1c8e951bcf7ade30f7947",
            "66a1c8e951bcf7ade30f7948",
            "66a1c8e951bcf7ade30f7949",
            "66a1c8e951bcf7ade30f794a",
            "66a1c8e951bcf7ade30f794b"
        };
        private string _keyToUse = "66a1c2502b6fdd6c620ba891";
        private string _location = " ";

        public void Start()
        {

            //Get current location
            if (Singleton<GameWorld>.Instantiated) 
            {
                _location = Singleton<GameWorld>.Instance.MainPlayer.Location;
            }

            //Set keys for every map
            switch (_location)
            {
                case "factory4_day":
                case "factory4_night":
                    _keyToUse = _keys[0];
                    break;
                case "RezervBase":
                    _keyToUse = _keys[1];
                    break;
                case "Shoreline":
                    _keyToUse = _keys[2];
                    break;
                case "bigmap":
                    _keyToUse = _keys[3];
                    break;
                case "Woods":
                    _keyToUse = _keys[4];
                    break;
                case "Interchange":
                    _keyToUse = _keys[5];
                    break;
                case "Lighthouse":
                    _keyToUse = _keys[6];
                    break;
                case "TarkovStreets":
                    _keyToUse = _keys[7];
                    break;
                case "Sandbox": case "Sandbox_High":
                    _keyToUse = _keys[8];
                    break;
                case "laboratory":
                    _keyToUse = _keys[9];
                    break;
            }

            if (!CheckPlayer())
            {
                return;
            }

            List<Door> allDoors = UnityEngine.Object.FindObjectsOfType<Door>().ToList(); // mechanical doors

            foreach (Door door in allDoors)  // mechanical doors
            {
                if (!door.KeyId.IsNullOrWhiteSpace() || !door.KeyId.IsNullOrEmpty())
                {
                    door.KeyId = _keyToUse;
                }
            }
        }

        public bool CheckPlayer()
        {
            return Singleton<GameWorld>.Instance.MainPlayer.Profile.Inventory.Equipment.GetAllItems()
                .Any(item => item.TemplateId == _keyToUse);
        }
    }
}
