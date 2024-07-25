using BepInEx;
using BepInEx.Configuration;
using BepInEx.Logging;
using configurable_keys.Patches;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace configurable_keys
{
    [BepInPlugin("com.Super.configurable-keys", "Configurable Keys", "2.0.0")]
    public class Plugin : BaseUnityPlugin
    {
        public static ManualLogSource LogSource;

        private void Awake()
        {
            LogSource = Logger;
            LogSource.LogInfo("configurable-keys loaded!.");

            new MasterKeyPatch().Enable();
        }
    }
}
