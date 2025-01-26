using BepInEx;
using Comfort.Common;
using EFT;
using EFT.Interactive;
using System.Collections.Generic;
using System.Linq;
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
        private readonly string[] _keyNames =
        {
            "Factory MK",
            "Reserve MK",
            "Shore MK",
            "Customs MK",
            "Woods MK",
            "Inter MK",
            "Lighthouse MK",
            "Streets MK",
            "Ground-Zero MK",
            "Labs MK"
        };
        private string _keyToUse = " ";
        private string _KeyName = " ";
        private string _location = " ";
        private string _doorType = " ";

        public void Start()
        {

            //Get current location
            if (Singleton<GameWorld>.Instantiated) 
            {
                _location = Singleton<GameWorld>.Instance.MainPlayer.Location;
                Plugin.LogSource.LogWarning($"Logging location, You spawned at -> {_location}");
            }

            //Set keys for every map
            switch (_location)
            {
                case "factory4_day":
                case "factory4_night":
                    _keyToUse = _keys[0];
                    _KeyName = _keyNames[0];
                    break;
                case "RezervBase":
                    _keyToUse = _keys[1];
                    _KeyName = _keyNames[1];
                    break;
                case "Shoreline":
                    _keyToUse = _keys[2];
                    _KeyName = _keyNames[2];
                    break;
                case "bigmap":
                    _keyToUse = _keys[3];
                    _KeyName = _keyNames[3];
                    break;
                case "Woods":
                    _keyToUse = _keys[4];
                    _KeyName = _keyNames[4];
                    break;
                case "Interchange":
                    _keyToUse = _keys[5];
                    _KeyName = _keyNames[5];
                    break;
                case "Lighthouse":
                    _keyToUse = _keys[6];
                    _KeyName = _keyNames[6];
                    break;
                case "TarkovStreets":
                    _keyToUse = _keys[7];
                    _KeyName = _keyNames[7];
                    break;
                case "Sandbox": 
                case "Sandbox_high":
                    _keyToUse = _keys[8];
                    _KeyName = _keyNames[8];
                    break;
                case "laboratory":
                    _keyToUse = _keys[9];
                    _KeyName = _keyNames[9];
                    break;
            }

            Plugin.LogSource.LogWarning($"Key to use at '{_location}' -> {_keyToUse} :: {_KeyName}");

            if (!CheckPlayer())
            {
                Plugin.LogSource.LogWarning($"No Key detected on players inventory");
                return;
            }

            List<Door> allDoors = UnityEngine.Object.FindObjectsOfType<Door>().ToList(); // mechanical doors

            Plugin.LogSource.LogWarning($"Doors found -> {allDoors.ToArray()}");

            foreach (Door door in allDoors)  // mechanical doors
            {



                if (!door.KeyId.IsNullOrWhiteSpace() || !door.KeyId.IsNullOrEmpty())
                {

                    _doorType = door.GetType().ToString();

                    if (door.GetType() == typeof(EFT.Interactive.KeycardDoor))
                    {
                        Plugin.LogSource.LogWarning($"This door uses a keycard :: {door}");
                        continue;
                    }


                    // DEBUG LOGS
                    Plugin.LogSource.LogWarning($"Door :: {door}");
                    Plugin.LogSource.LogWarning($"Door KeyType and Id -> {door.TypeKey} :: {door.KeyId}");
                    Plugin.LogSource.LogWarning($"Door Name :: {door.name}");
                    Plugin.LogSource.LogWarning($"Door Type :: {door.GetType().ToString()}");
                    Plugin.LogSource.LogWarning($"Door Id :: {door.Id}");
                    Plugin.LogSource.LogWarning($"Door Tag :: {door.tag}");

                    door.KeyId = _keyToUse;

                }

                // ADD SHITURMANS STASH
            }
        }

        public bool CheckPlayer()
        {
            return Singleton<GameWorld>.Instance.MainPlayer.Profile.Inventory.Equipment.GetAllItems()
                .Any(item => item.TemplateId == _keyToUse);
        }
    }
}
