using BepInEx;
using BepInEx.Logging;
using configurable_keys.Patches;

namespace configurable_keys
{
    [BepInPlugin("com.Super.configurable-keys", "Configurable Keys", "2.1.0")]
    public class Plugin : BaseUnityPlugin
    {
        public static ManualLogSource LogSource;

        private void Awake()
        {
            LogSource = Logger;
            LogSource.LogInfo("configurable-keys 2.1.0 loaded!.");

            new MasterKeyPatch().Enable();
        }
    }
}
