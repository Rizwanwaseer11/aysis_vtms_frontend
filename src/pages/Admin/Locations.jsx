import React, { useEffect, useMemo, useState } from "react";

import {
  ChevronDown,
  ChevronUp,
  MapPin,
  Pencil,
  Trash2,
  MapPinned,
  MapPinHouse,
} from "lucide-react";
import GoogleMapView from "../../components/MapView";
import {
  useCreateBin08Mutation,
  useCreateBin5Mutation,
  useCreateUCMutation,
  useCreateKundiPointMutation,
  useCreateGtsPointMutation,
  useCreateWardMutation,
  useCreateZoneMutation,
  useGetBin08Query,
  useGetBin5Query,
  useGetGtsPointsQuery,
  useGetKundiPointsQuery,
  useGetUCsQuery,
  useGetWardsQuery,
  useGetZonesQuery,
} from "../../store/api";

const Locations = () => {
  const {
    data: zonesResponse,
    isLoading: zonesLoading,
    isError: zonesError,
  } = useGetZonesQuery();
  const {
    data: ucsResponse,
    isLoading: ucsLoading,
    isError: ucsError,
  } = useGetUCsQuery();
  const {
    data: wardsResponse,
    isLoading: wardsLoading,
    isError: wardsError,
  } = useGetWardsQuery();
  const {
    data: bin08Response,
    isLoading: bin08Loading,
    isError: bin08Error,
  } = useGetBin08Query({ page: 1, perPage: 100 });
  const { data: bin5Response } = useGetBin5Query({ page: 1, perPage: 100 });

  const zones = zonesResponse?.data?.items || [];
  const ucs = ucsResponse?.data?.items || [];
  const wards = wardsResponse?.data?.items || [];
  const bin08Items = bin08Response?.data?.items || [];
  const bin5Items = bin5Response?.data?.items || [];
  const bin08Total = bin08Response?.meta?.total ?? bin08Items.length;
  const bin5Total =
    bin5Response?.meta?.total ?? bin5Items.length;
  const totalBins = (bin08Total || 0) + (bin5Total || 0);

  const stats = useMemo(
    () => [
      {
        title: "Total Zones",
        value: zonesLoading ? "--" : zones.length,
        icon: <ZoneIcon size={22} />,
        bg: "bg-orange-100",
        iconBg: "bg-orange-500",
      },
      {
        title: "Total UCs",
        value: ucsLoading ? "--" : ucs.length,
        icon: <MapPinned size={22} />,
        bg: "bg-blue-100",
        iconBg: "bg-blue-400",
      },
      {
        title: "Total Wards",
        value: wardsLoading ? "--" : wards.length,
        icon: <MapPinHouse size={22} />,
        bg: "bg-green-100",
        iconBg: "bg-green-500",
      },
      {
        title: "Total Bins ",
        value: bin08Loading ? "--" : totalBins,
        icon: <Trash2 size={22} />,
        bg: "bg-green-100",
        iconBg: "bg-green-500",
      },
    ],
    [
      zones.length,
      zonesLoading,
      ucs.length,
      ucsLoading,
      wards.length,
      wardsLoading,
      totalBins,
      bin08Loading,
    ],
  );

  return (
    <div className="mt-8 ">
      <DashboardStats stats={stats} />
      <LocationManagement
        zones={zones}
        ucs={ucs}
        wards={wards}
        bin08Items={bin08Items}
        bin5Items={bin5Items}
        zonesLoading={zonesLoading}
        ucsLoading={ucsLoading}
        wardsLoading={wardsLoading}
        zonesError={zonesError}
        ucsError={ucsError}
        wardsError={wardsError}
        binsError={bin08Error}
      />
      <GoogleMapView bins={bin08Items} />
    </div>
  );
};

export default Locations;

const DashboardStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 p-4 gap-6">
      {stats.map((item, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl p-6 flex items-center justify-between shadow-md hover:shadow-lg  "
        >
          <div>
            <p className="text-gray-500 text-sm">{item.title}</p>
            <h2 className="text-2xl  mt-2">{item.value}</h2>
          </div>

          <div
            className={`w-12 h-12 flex items-center justify-center rounded-xl text-white ${item.iconBg}`}
          >
            {item.icon}
          </div>
        </div>
      ))}
    </div>
  );
};

const ZoneIcon = ({ size = 32, color = "orange", imageSize = 30 }) => {
  const bgColor = `bg-${color}-500`; // Tailwind dynamic class
  return (
    <div
      className={`${bgColor} rounded-2xl flex items-center justify-center`}
      style={{ width: size, height: size }}
    >
      <img
        src="/place.png" // make sure image is in public folder
        alt="zone icon"
        style={{ width: 40, height: 30 }}
      />
    </div>
  );
};

function LocationManagement({
  zones,
  ucs,
  wards,
  bin08Items,
  bin5Items,
  zonesLoading,
  ucsLoading,
  wardsLoading,
  zonesError,
  ucsError,
  wardsError,
  binsError,
}) {
  const [openZone, setOpenZone] = useState(null);
  const [activeSection, setActiveSection] = useState("hierarchy");
  const [activeForm, setActiveForm] = useState(null);
  const [formError, setFormError] = useState("");
  const { notice, showNotice, clearNotice } = useTimedNotice();

  const [zoneForm, setZoneForm] = useState({ name: "" });
  const [ucForm, setUcForm] = useState({ zoneId: "", name: "" });
  const [wardForm, setWardForm] = useState({ zoneId: "", ucId: "", name: "" });
  const [kundiForm, setKundiForm] = useState({
    zoneId: "",
    ucId: "",
    wardId: "",
    name: "",
    lat: "",
    lng: "",
    radiusM: "50",
  });
  const [gtsForm, setGtsForm] = useState({
    name: "",
    lat: "",
    lng: "",
    radiusM: "80",
  });
  const [bin5Form, setBin5Form] = useState({ binNumber: "" });
  const [binForm, setBinForm] = useState({
    zoneId: "",
    ucId: "",
    wardId: "",
    binNumber: "",
    lat: "",
    lng: "",
    radiusM: "30",
  });
  const [ucZoneFilter, setUcZoneFilter] = useState("");
  const [wardZoneFilter, setWardZoneFilter] = useState("");
  const [wardUcFilter, setWardUcFilter] = useState("");
  const [binWardFilter, setBinWardFilter] = useState("");
  const [binSearch, setBinSearch] = useState("");
  const [bin5Search, setBin5Search] = useState("");
  const [kundiWardFilter, setKundiWardFilter] = useState("");
  const [kundiSearch, setKundiSearch] = useState("");
  const [kundiPage, setKundiPage] = useState(1);
  const [gtsSearch, setGtsSearch] = useState("");

  const [createZone, { isLoading: isCreatingZone }] =
    useCreateZoneMutation();
  const [createUC, { isLoading: isCreatingUC }] = useCreateUCMutation();
  const [createWard, { isLoading: isCreatingWard }] =
    useCreateWardMutation();
  const [createBin08, { isLoading: isCreatingBin08 }] =
    useCreateBin08Mutation();
  const [createBin5, { isLoading: isCreatingBin5 }] =
    useCreateBin5Mutation();
  const [createKundiPoint, { isLoading: isCreatingKundi }] =
    useCreateKundiPointMutation();
  const [createGtsPoint, { isLoading: isCreatingGts }] =
    useCreateGtsPointMutation();

  const {
    data: kundiResponse,
    isLoading: kundiLoading,
    isError: kundiError,
  } = useGetKundiPointsQuery(
    {
      page: kundiPage,
      perPage: 20,
      wardId: kundiWardFilter || undefined,
      q: kundiSearch.trim() || undefined,
    },
    { refetchOnMountOrArgChange: true },
  );

  const {
    data: gtsResponse,
    isLoading: gtsLoading,
    isError: gtsError,
  } = useGetGtsPointsQuery();

  const isLoading = zonesLoading || ucsLoading || wardsLoading;
  const isError = zonesError || ucsError || wardsError;
  const kundiItems = kundiResponse?.data?.items || [];
  const kundiMeta = kundiResponse?.meta || {
    total: kundiItems.length,
    totalPages: 1,
    page: kundiPage,
  };
  const gtsItems = gtsResponse?.data?.items || [];
  const kundiTotalPages = Math.max(1, kundiMeta.totalPages || 1);

  useEffect(() => {
    setKundiPage(1);
  }, [kundiWardFilter, kundiSearch]);

  useEffect(() => {
    if (kundiPage > kundiTotalPages) {
      setKundiPage(kundiTotalPages);
    }
  }, [kundiPage, kundiTotalPages]);

  const ucsByZone = useMemo(() => {
    const map = {};
    ucs.forEach((uc) => {
      const key = String(uc.zoneId);
      if (!map[key]) map[key] = [];
      map[key].push(uc);
    });
    return map;
  }, [ucs]);

  const wardsByUc = useMemo(() => {
    const map = {};
    wards.forEach((ward) => {
      const key = String(ward.ucId);
      if (!map[key]) map[key] = [];
      map[key].push(ward);
    });
    return map;
  }, [wards]);

  const wardsByZone = useMemo(() => {
    const map = {};
    wards.forEach((ward) => {
      const key = String(ward.zoneId);
      if (!map[key]) map[key] = [];
      map[key].push(ward);
    });
    return map;
  }, [wards]);

  const zonesWithUcs = useMemo(
    () =>
      zones.map((zone) => {
        const zoneUcs = (ucsByZone[zone._id] || []).map((uc) => {
          const wardCount = wardsByUc[uc._id]?.length || 0;
          return {
            ...uc,
            progress: wardCount ? `${wardCount} Wards` : "No wards yet",
            status: wardCount ? "completed" : "progress",
          };
        });
        return { ...zone, ucs: zoneUcs };
      }),
    [zones, ucsByZone, wardsByUc],
  );

  const filteredUcs = useMemo(() => {
    if (!ucZoneFilter) return ucs;
    return ucs.filter((uc) => uc.zoneId === ucZoneFilter);
  }, [ucs, ucZoneFilter]);

  const wardUcFilterOptions = useMemo(() => {
    if (!wardZoneFilter) return ucs;
    return ucs.filter((uc) => uc.zoneId === wardZoneFilter);
  }, [ucs, wardZoneFilter]);

  const filteredWards = useMemo(() => {
    if (wardUcFilter) {
      return wards.filter((ward) => ward.ucId === wardUcFilter);
    }
    if (wardZoneFilter) {
      return wards.filter((ward) => ward.zoneId === wardZoneFilter);
    }
    return wards;
  }, [wards, wardZoneFilter, wardUcFilter]);

  const filteredBins = useMemo(() => {
    const query = binSearch.trim().toLowerCase();
    return (bin08Items || []).filter((bin) => {
      if (binWardFilter && bin.wardId !== binWardFilter) return false;
      if (!query) return true;
      const text = [
        bin.binNumber,
        bin.zoneName,
        bin.ucName,
        bin.wardName,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return text.includes(query);
    });
  }, [bin08Items, binWardFilter, binSearch]);

  const filteredBin5 = useMemo(() => {
    const query = bin5Search.trim().toLowerCase();
    if (!query) return bin5Items || [];
    return (bin5Items || []).filter((bin) =>
      String(bin.binNumber || "")
        .toLowerCase()
        .includes(query),
    );
  }, [bin5Items, bin5Search]);

  const filteredGts = useMemo(() => {
    const query = gtsSearch.trim().toLowerCase();
    if (!query) return gtsItems;
    return gtsItems.filter((point) =>
      String(point.name || "")
        .toLowerCase()
        .includes(query),
    );
  }, [gtsItems, gtsSearch]);

  useEffect(() => {
    if (!zones.length) return;
    if (!openZone || !zones.some((zone) => zone._id === openZone)) {
      setOpenZone(zones[0]._id);
    }
  }, [zones, openZone]);

  useEffect(() => {
    if (!zones.length) return;
    setUcForm((prev) => {
      if (prev.zoneId && zones.some((zone) => zone._id === prev.zoneId)) {
        return prev;
      }
      return { ...prev, zoneId: zones[0]._id };
    });
    setWardForm((prev) => {
      if (prev.zoneId && zones.some((zone) => zone._id === prev.zoneId)) {
        return prev;
      }
      return { ...prev, zoneId: zones[0]._id };
    });
    setKundiForm((prev) => {
      if (prev.zoneId && zones.some((zone) => zone._id === prev.zoneId)) {
        return prev;
      }
      return { ...prev, zoneId: zones[0]._id };
    });
    setBinForm((prev) => {
      if (prev.zoneId && zones.some((zone) => zone._id === prev.zoneId)) {
        return prev;
      }
      return { ...prev, zoneId: zones[0]._id };
    });
  }, [zones]);

  const wardUcOptions = useMemo(() => {
    if (!wardForm.zoneId) return [];
    return ucs.filter((uc) => uc.zoneId === wardForm.zoneId);
  }, [ucs, wardForm.zoneId]);

  const binUcOptions = useMemo(() => {
    if (!binForm.zoneId) return [];
    return ucs.filter((uc) => uc.zoneId === binForm.zoneId);
  }, [ucs, binForm.zoneId]);

  const binWardOptions = useMemo(() => {
    if (binForm.ucId) {
      return wards.filter((ward) => ward.ucId === binForm.ucId);
    }
    if (binForm.zoneId) {
      return wards.filter((ward) => ward.zoneId === binForm.zoneId);
    }
    return [];
  }, [wards, binForm.ucId, binForm.zoneId]);

  const kundiUcOptions = useMemo(() => {
    if (!kundiForm.zoneId) return [];
    return ucs.filter((uc) => uc.zoneId === kundiForm.zoneId);
  }, [ucs, kundiForm.zoneId]);

  const kundiWardOptions = useMemo(() => {
    if (kundiForm.ucId) {
      return wards.filter((ward) => ward.ucId === kundiForm.ucId);
    }
    if (kundiForm.zoneId) {
      return wards.filter((ward) => ward.zoneId === kundiForm.zoneId);
    }
    return [];
  }, [wards, kundiForm.ucId, kundiForm.zoneId]);

  useEffect(() => {
    if (activeForm !== "ward") return;
    if (!wardUcOptions.length) {
      setWardForm((prev) => (prev.ucId ? { ...prev, ucId: "" } : prev));
      return;
    }
    if (!wardUcOptions.some((uc) => uc._id === wardForm.ucId)) {
      setWardForm((prev) => ({ ...prev, ucId: wardUcOptions[0]._id }));
    }
  }, [activeForm, wardUcOptions, wardForm.ucId]);

  useEffect(() => {
    if (activeForm !== "bin") return;
    if (!binUcOptions.length) {
      setBinForm((prev) => (prev.ucId ? { ...prev, ucId: "" } : prev));
      return;
    }
    if (!binUcOptions.some((uc) => uc._id === binForm.ucId)) {
      setBinForm((prev) => ({ ...prev, ucId: binUcOptions[0]._id }));
    }
  }, [activeForm, binUcOptions, binForm.ucId]);

  useEffect(() => {
    if (activeForm !== "bin") return;
    if (!binWardOptions.length) {
      setBinForm((prev) => (prev.wardId ? { ...prev, wardId: "" } : prev));
      return;
    }
    if (!binWardOptions.some((ward) => ward._id === binForm.wardId)) {
      setBinForm((prev) => ({ ...prev, wardId: binWardOptions[0]._id }));
    }
  }, [activeForm, binWardOptions, binForm.wardId]);

  useEffect(() => {
    if (activeForm !== "kundi") return;
    if (!kundiUcOptions.length) {
      setKundiForm((prev) => (prev.ucId ? { ...prev, ucId: "" } : prev));
      return;
    }
    if (!kundiUcOptions.some((uc) => uc._id === kundiForm.ucId)) {
      setKundiForm((prev) => ({ ...prev, ucId: kundiUcOptions[0]._id }));
    }
  }, [activeForm, kundiUcOptions, kundiForm.ucId]);

  useEffect(() => {
    if (activeForm !== "kundi") return;
    if (!kundiWardOptions.length) {
      setKundiForm((prev) => (prev.wardId ? { ...prev, wardId: "" } : prev));
      return;
    }
    if (!kundiWardOptions.some((ward) => ward._id === kundiForm.wardId)) {
      setKundiForm((prev) => ({ ...prev, wardId: kundiWardOptions[0]._id }));
    }
  }, [activeForm, kundiWardOptions, kundiForm.wardId]);

  const toggleZone = (id) => {
    setOpenZone(openZone === id ? null : id);
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
    setFormError("");
    clearNotice();
    setActiveForm(null);
  };

  const toggleForm = (formName, section = formName) => {
    setFormError("");
    clearNotice();
    setActiveSection(section);
    setActiveForm((prev) => (prev === formName ? null : formName));
  };

  const handleKundiPageChange = (page) => {
    if (page < 1 || page > kundiTotalPages) return;
    setKundiPage(page);
  };

  const handleCreateZone = async (event) => {
    event.preventDefault();
    setFormError("");
    const name = zoneForm.name.trim();
    if (!name) {
      const message = "Zone name is required.";
      setFormError(message);
      showNotice("error", message);
      return;
    }
    try {
      await createZone({ name }).unwrap();
      showNotice("success", "Zone created successfully.");
      setZoneForm({ name: "" });
      setActiveForm(null);
    } catch (error) {
      const message =
        error?.data?.message || error?.error || "Unable to create zone.";
      setFormError(message);
      showNotice("error", message);
    }
  };

  const handleCreateUC = async (event) => {
    event.preventDefault();
    setFormError("");
    const name = ucForm.name.trim();
    if (!ucForm.zoneId) {
      const message = "Please select a zone.";
      setFormError(message);
      showNotice("error", message);
      return;
    }
    if (!name) {
      const message = "UC name is required.";
      setFormError(message);
      showNotice("error", message);
      return;
    }
    try {
      await createUC({ zoneId: ucForm.zoneId, name }).unwrap();
      showNotice("success", "UC created successfully.");
      setUcForm((prev) => ({ ...prev, name: "" }));
      setActiveForm(null);
    } catch (error) {
      const message =
        error?.data?.message || error?.error || "Unable to create UC.";
      setFormError(message);
      showNotice("error", message);
    }
  };

  const handleCreateWard = async (event) => {
    event.preventDefault();
    setFormError("");
    const name = wardForm.name.trim();
    if (!wardForm.ucId) {
      const message = "Please select a UC.";
      setFormError(message);
      showNotice("error", message);
      return;
    }
    if (!name) {
      const message = "Ward name is required.";
      setFormError(message);
      showNotice("error", message);
      return;
    }
    try {
      await createWard({ ucId: wardForm.ucId, name }).unwrap();
      showNotice("success", "Ward created successfully.");
      setWardForm((prev) => ({ ...prev, name: "" }));
      setActiveForm(null);
    } catch (error) {
      const message =
        error?.data?.message || error?.error || "Unable to create ward.";
      setFormError(message);
      showNotice("error", message);
    }
  };

  const handleCreateBin = async (event) => {
    event.preventDefault();
    setFormError("");
    const binNumber = binForm.binNumber.trim();
    const lat = Number(binForm.lat);
    const lng = Number(binForm.lng);
    const radiusM = Number(binForm.radiusM);

    if (!binForm.wardId) {
      const message = "Please select a ward.";
      setFormError(message);
      showNotice("error", message);
      return;
    }
    if (!binNumber) {
      const message = "Bin number is required.";
      setFormError(message);
      showNotice("error", message);
      return;
    }
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      const message = "Please enter valid latitude and longitude.";
      setFormError(message);
      showNotice("error", message);
      return;
    }
    if (!Number.isFinite(radiusM) || radiusM <= 0) {
      const message = "Please enter a valid radius.";
      setFormError(message);
      showNotice("error", message);
      return;
    }

    try {
      await createBin08({
        wardId: binForm.wardId,
        binNumber,
        lat,
        lng,
        radiusM,
      }).unwrap();
      showNotice("success", "Bin created successfully.");
      setBinForm((prev) => ({
        ...prev,
        binNumber: "",
        lat: "",
        lng: "",
        radiusM: "30",
      }));
      setActiveForm(null);
    } catch (error) {
      const message =
        error?.data?.message || error?.error || "Unable to create bin.";
      setFormError(message);
      showNotice("error", message);
    }
  };

  const handleCreateBin5 = async (event) => {
    event.preventDefault();
    setFormError("");
    const binNumber = bin5Form.binNumber.trim();
    if (!binNumber) {
      const message = "Bin number is required.";
      setFormError(message);
      showNotice("error", message);
      return;
    }
    try {
      await createBin5({ binNumber }).unwrap();
      showNotice("success", "5m bin created successfully.");
      setBin5Form({ binNumber: "" });
      setActiveForm(null);
    } catch (error) {
      const message =
        error?.data?.message || error?.error || "Unable to create 5m bin.";
      setFormError(message);
      showNotice("error", message);
    }
  };

  const handleCreateKundi = async (event) => {
    event.preventDefault();
    setFormError("");
    const name = kundiForm.name.trim();
    const lat = Number(kundiForm.lat);
    const lng = Number(kundiForm.lng);
    const radiusM = Number(kundiForm.radiusM);

    if (!kundiForm.wardId) {
      const message = "Please select a ward.";
      setFormError(message);
      showNotice("error", message);
      return;
    }
    if (!name) {
      const message = "Kundi name is required.";
      setFormError(message);
      showNotice("error", message);
      return;
    }
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      const message = "Please enter valid latitude and longitude.";
      setFormError(message);
      showNotice("error", message);
      return;
    }
    if (!Number.isFinite(radiusM) || radiusM <= 0) {
      const message = "Please enter a valid radius.";
      setFormError(message);
      showNotice("error", message);
      return;
    }

    try {
      await createKundiPoint({
        wardId: kundiForm.wardId,
        name,
        lat,
        lng,
        radiusM,
      }).unwrap();
      showNotice("success", "Kundi point created successfully.");
      setKundiForm((prev) => ({
        ...prev,
        name: "",
        lat: "",
        lng: "",
        radiusM: "50",
      }));
      setActiveForm(null);
    } catch (error) {
      const message =
        error?.data?.message || error?.error || "Unable to create kundi point.";
      setFormError(message);
      showNotice("error", message);
    }
  };

  const handleCreateGts = async (event) => {
    event.preventDefault();
    setFormError("");
    const name = gtsForm.name.trim();
    const lat = Number(gtsForm.lat);
    const lng = Number(gtsForm.lng);
    const radiusM = Number(gtsForm.radiusM);

    if (!name) {
      const message = "GTS name is required.";
      setFormError(message);
      showNotice("error", message);
      return;
    }
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      const message = "Please enter valid latitude and longitude.";
      setFormError(message);
      showNotice("error", message);
      return;
    }
    if (!Number.isFinite(radiusM) || radiusM <= 0) {
      const message = "Please enter a valid radius.";
      setFormError(message);
      showNotice("error", message);
      return;
    }

    try {
      await createGtsPoint({ name, lat, lng, radiusM }).unwrap();
      showNotice("success", "GTS point created successfully.");
      setGtsForm({ name: "", lat: "", lng: "", radiusM: "80" });
      setActiveForm(null);
    } catch (error) {
      const message =
        error?.data?.message || error?.error || "Unable to create GTS point.";
      setFormError(message);
      showNotice("error", message);
    }
  };

  const sections = [
    { id: "hierarchy", label: "Hierarchy" },
    { id: "zones", label: "Zones" },
    { id: "ucs", label: "UCs" },
    { id: "wards", label: "Wards" },
    { id: "kundi", label: "Kundi Points" },
    { id: "gts", label: "GTS Points" },
    { id: "bins08", label: "0.8 Bins" },
    { id: "bins5", label: "5m Bins" },
  ];

  return (
    <div className="mt-4 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-3xl shadow-lg p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Location Management</h2>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => toggleForm("zone", "zones")}
              className="bg-black text-white px-5 py-2 rounded-xl"
            >
              + Add Zone
            </button>
            <button
              type="button"
              onClick={() => toggleForm("uc", "ucs")}
              className="bg-gray-200 px-5 py-2 rounded-xl"
            >
              + Add UCs
            </button>
            <button
              type="button"
              onClick={() => toggleForm("ward", "wards")}
              className="bg-gray-200 px-5 py-2 rounded-xl"
            >
              + Add Wards
            </button>
            <button
              type="button"
              onClick={() => toggleForm("bin", "bins08")}
              className="bg-gray-200 px-5 py-2 rounded-xl"
            >
              + Add Bins
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {sections.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => handleSectionChange(section.id)}
              className={
                activeSection === section.id
                  ? "bg-black text-white px-4 py-2 rounded-xl text-sm"
                  : "bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm"
              }
            >
              {section.label}
            </button>
          ))}
        </div>

        <NoticeBanner notice={notice} />

        {activeSection === "zones" && activeForm === "zone" && (
          <form
            onSubmit={handleCreateZone}
            className="mb-6 rounded-2xl border border-gray-200 bg-gray-50 p-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-600">
                  Zone Name
                </label>
                <input
                  type="text"
                  value={zoneForm.name}
                  onChange={(event) =>
                    setZoneForm({ name: event.target.value })
                  }
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                  placeholder="e.g. Zone 1"
                  required
                />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setActiveForm(null)}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isCreatingZone}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white disabled:opacity-70"
              >
                {isCreatingZone ? "Saving..." : "Create Zone"}
              </button>
            </div>
            {formError && (
              <div className="mt-3 text-sm text-red-600">{formError}</div>
            )}
          </form>
        )}

        {activeSection === "ucs" && activeForm === "uc" && (
          <form
            onSubmit={handleCreateUC}
            className="mb-6 rounded-2xl border border-gray-200 bg-gray-50 p-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-600">
                  Zone
                </label>
                <select
                  value={ucForm.zoneId}
                  onChange={(event) =>
                    setUcForm((prev) => ({
                      ...prev,
                      zoneId: event.target.value,
                    }))
                  }
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                  disabled={!zones.length}
                  required
                >
                  <option value="">
                    {zones.length ? "Select zone" : "No zones available"}
                  </option>
                  {zones.map((zone) => (
                    <option key={zone._id} value={zone._id}>
                      {zone.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600">
                  UC Name
                </label>
                <input
                  type="text"
                  value={ucForm.name}
                  onChange={(event) =>
                    setUcForm((prev) => ({ ...prev, name: event.target.value }))
                  }
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                  placeholder="e.g. Union Council 1"
                  required
                />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setActiveForm(null)}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isCreatingUC || !zones.length}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white disabled:opacity-70"
              >
                {isCreatingUC ? "Saving..." : "Create UC"}
              </button>
            </div>
            {formError && (
              <div className="mt-3 text-sm text-red-600">{formError}</div>
            )}
          </form>
        )}

        {activeSection === "wards" && activeForm === "ward" && (
          <form
            onSubmit={handleCreateWard}
            className="mb-6 rounded-2xl border border-gray-200 bg-gray-50 p-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-600">
                  Zone
                </label>
                <select
                  value={wardForm.zoneId}
                  onChange={(event) =>
                    setWardForm((prev) => ({
                      ...prev,
                      zoneId: event.target.value,
                    }))
                  }
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                  disabled={!zones.length}
                >
                  <option value="">
                    {zones.length ? "Select zone" : "No zones available"}
                  </option>
                  {zones.map((zone) => (
                    <option key={zone._id} value={zone._id}>
                      {zone.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600">
                  UC
                </label>
                <select
                  value={wardForm.ucId}
                  onChange={(event) =>
                    setWardForm((prev) => ({
                      ...prev,
                      ucId: event.target.value,
                    }))
                  }
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                  disabled={!wardUcOptions.length}
                  required
                >
                  <option value="">
                    {wardUcOptions.length ? "Select UC" : "No UCs available"}
                  </option>
                  {wardUcOptions.map((uc) => (
                    <option key={uc._id} value={uc._id}>
                      {uc.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600">
                  Ward Name
                </label>
                <input
                  type="text"
                  value={wardForm.name}
                  onChange={(event) =>
                    setWardForm((prev) => ({
                      ...prev,
                      name: event.target.value,
                    }))
                  }
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                  placeholder="e.g. Ward 1"
                  required
                />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setActiveForm(null)}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isCreatingWard || !wardUcOptions.length}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white disabled:opacity-70"
              >
                {isCreatingWard ? "Saving..." : "Create Ward"}
              </button>
            </div>
            {formError && (
              <div className="mt-3 text-sm text-red-600">{formError}</div>
            )}
          </form>
        )}

        {activeSection === "bins08" && activeForm === "bin" && (
          <form
            onSubmit={handleCreateBin}
            className="mb-6 rounded-2xl border border-gray-200 bg-gray-50 p-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-600">
                  Zone
                </label>
                <select
                  value={binForm.zoneId}
                  onChange={(event) =>
                    setBinForm((prev) => ({
                      ...prev,
                      zoneId: event.target.value,
                    }))
                  }
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                  disabled={!zones.length}
                >
                  <option value="">
                    {zones.length ? "Select zone" : "No zones available"}
                  </option>
                  {zones.map((zone) => (
                    <option key={zone._id} value={zone._id}>
                      {zone.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600">
                  UC
                </label>
                <select
                  value={binForm.ucId}
                  onChange={(event) =>
                    setBinForm((prev) => ({ ...prev, ucId: event.target.value }))
                  }
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                  disabled={!binUcOptions.length}
                >
                  <option value="">
                    {binUcOptions.length ? "Select UC" : "No UCs available"}
                  </option>
                  {binUcOptions.map((uc) => (
                    <option key={uc._id} value={uc._id}>
                      {uc.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600">
                  Ward
                </label>
                <select
                  value={binForm.wardId}
                  onChange={(event) =>
                    setBinForm((prev) => ({
                      ...prev,
                      wardId: event.target.value,
                    }))
                  }
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                  disabled={!binWardOptions.length}
                  required
                >
                  <option value="">
                    {binWardOptions.length ? "Select ward" : "No wards available"}
                  </option>
                  {binWardOptions.map((ward) => (
                    <option key={ward._id} value={ward._id}>
                      {ward.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600">
                  Bin Number
                </label>
                <input
                  type="text"
                  value={binForm.binNumber}
                  onChange={(event) =>
                    setBinForm((prev) => ({
                      ...prev,
                      binNumber: event.target.value,
                    }))
                  }
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                  placeholder="e.g. B-001"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600">
                  Latitude
                </label>
                <input
                  type="number"
                  step="any"
                  value={binForm.lat}
                  onChange={(event) =>
                    setBinForm((prev) => ({ ...prev, lat: event.target.value }))
                  }
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                  placeholder="24.8607"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600">
                  Longitude
                </label>
                <input
                  type="number"
                  step="any"
                  value={binForm.lng}
                  onChange={(event) =>
                    setBinForm((prev) => ({ ...prev, lng: event.target.value }))
                  }
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                  placeholder="67.0011"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600">
                  Radius (m)
                </label>
                <input
                  type="number"
                  step="any"
                  value={binForm.radiusM}
                  onChange={(event) =>
                    setBinForm((prev) => ({
                      ...prev,
                      radiusM: event.target.value,
                    }))
                  }
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                  placeholder="30"
                  required
                />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setActiveForm(null)}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isCreatingBin08 || !binWardOptions.length}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white disabled:opacity-70"
              >
                {isCreatingBin08 ? "Saving..." : "Create Bin"}
              </button>
            </div>
            {formError && (
              <div className="mt-3 text-sm text-red-600">{formError}</div>
            )}
          </form>
        )}

        {activeSection === "zones" && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Zones</h3>
            <div className="space-y-3">
              {zonesLoading && (
                <div className="px-4 py-6 text-sm text-gray-500">
                  Loading zones...
                </div>
              )}
              {zonesError && (
                <div className="px-4 py-6 text-sm text-red-500">
                  Unable to load zones.
                </div>
              )}
              {!zonesLoading && !zonesError && zones.length === 0 && (
                <div className="px-4 py-6 text-sm text-gray-500">
                  No zones found.
                </div>
              )}
              {zones.map((zone) => (
                <div
                  key={zone._id}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium">{zone.name}</p>
                    <p className="text-xs text-gray-500">
                      {(ucsByZone[zone._id] || []).length} UCs - 
                      {(wardsByZone[zone._id] || []).length} Wards
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Pencil
                      size={16}
                      className="cursor-not-allowed text-gray-400"
                    />
                    <Trash2
                      size={16}
                      className="text-gray-300 cursor-not-allowed"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === "ucs" && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Union Councils</h3>
              <span className="text-xs text-gray-500">
                {filteredUcs.length} UCs
              </span>
            </div>
            <div className="flex flex-wrap gap-3 mb-4">
              <select
                value={ucZoneFilter}
                onChange={(event) => setUcZoneFilter(event.target.value)}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
              >
                <option value="">All Zones</option>
                {zones.map((zone) => (
                  <option key={zone._id} value={zone._id}>
                    {zone.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-3">
              {ucsLoading && (
                <div className="px-4 py-6 text-sm text-gray-500">
                  Loading UCs...
                </div>
              )}
              {ucsError && (
                <div className="px-4 py-6 text-sm text-red-500">
                  Unable to load UCs.
                </div>
              )}
              {!ucsLoading && !ucsError && filteredUcs.length === 0 && (
                <div className="px-4 py-6 text-sm text-gray-500">
                  No UCs found.
                </div>
              )}
              {filteredUcs.map((uc) => (
                <div
                  key={uc._id}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium">{uc.name}</p>
                    <p className="text-xs text-gray-500">
                      {uc.zoneName} - {(wardsByUc[uc._id] || []).length} Wards
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Pencil
                      size={16}
                      className="cursor-not-allowed text-gray-400"
                    />
                    <Trash2
                      size={16}
                      className="text-gray-300 cursor-not-allowed"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === "wards" && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Wards</h3>
              <span className="text-xs text-gray-500">
                {filteredWards.length} Wards
              </span>
            </div>
            <div className="flex flex-wrap gap-3 mb-4">
              <select
                value={wardZoneFilter}
                onChange={(event) => {
                  setWardZoneFilter(event.target.value);
                  setWardUcFilter("");
                }}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
              >
                <option value="">All Zones</option>
                {zones.map((zone) => (
                  <option key={zone._id} value={zone._id}>
                    {zone.name}
                  </option>
                ))}
              </select>
              <select
                value={wardUcFilter}
                onChange={(event) => setWardUcFilter(event.target.value)}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                disabled={!wardUcFilterOptions.length}
              >
                <option value="">All UCs</option>
                {wardUcFilterOptions.map((uc) => (
                  <option key={uc._id} value={uc._id}>
                    {uc.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-3">
              {wardsLoading && (
                <div className="px-4 py-6 text-sm text-gray-500">
                  Loading wards...
                </div>
              )}
              {wardsError && (
                <div className="px-4 py-6 text-sm text-red-500">
                  Unable to load wards.
                </div>
              )}
              {!wardsLoading && !wardsError && filteredWards.length === 0 && (
                <div className="px-4 py-6 text-sm text-gray-500">
                  No wards found.
                </div>
              )}
              {filteredWards.map((ward) => (
                <div
                  key={ward._id}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium">{ward.name}</p>
                    <p className="text-xs text-gray-500">
                      {ward.zoneName} - {ward.ucName}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Pencil
                      size={16}
                      className="cursor-not-allowed text-gray-400"
                    />
                    <Trash2
                      size={16}
                      className="text-gray-300 cursor-not-allowed"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === "kundi" && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Kundi Points</h3>
              <button
                type="button"
                onClick={() => toggleForm("kundi", "kundi")}
                className="bg-black text-white px-4 py-2 rounded-xl text-sm"
              >
                + Add Kundi
              </button>
            </div>

            {activeForm === "kundi" && (
              <form
                onSubmit={handleCreateKundi}
                className="mb-6 rounded-2xl border border-gray-200 bg-gray-50 p-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-600">
                      Zone
                    </label>
                    <select
                      value={kundiForm.zoneId}
                      onChange={(event) =>
                        setKundiForm((prev) => ({
                          ...prev,
                          zoneId: event.target.value,
                        }))
                      }
                      className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                      disabled={!zones.length}
                    >
                      <option value="">
                        {zones.length ? "Select zone" : "No zones available"}
                      </option>
                      {zones.map((zone) => (
                        <option key={zone._id} value={zone._id}>
                          {zone.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600">
                      UC
                    </label>
                    <select
                      value={kundiForm.ucId}
                      onChange={(event) =>
                        setKundiForm((prev) => ({
                          ...prev,
                          ucId: event.target.value,
                        }))
                      }
                      className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                      disabled={!kundiUcOptions.length}
                    >
                      <option value="">
                        {kundiUcOptions.length ? "Select UC" : "No UCs available"}
                      </option>
                      {kundiUcOptions.map((uc) => (
                        <option key={uc._id} value={uc._id}>
                          {uc.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600">
                      Ward
                    </label>
                    <select
                      value={kundiForm.wardId}
                      onChange={(event) =>
                        setKundiForm((prev) => ({
                          ...prev,
                          wardId: event.target.value,
                        }))
                      }
                      className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                      disabled={!kundiWardOptions.length}
                      required
                    >
                      <option value="">
                        {kundiWardOptions.length
                          ? "Select ward"
                          : "No wards available"}
                      </option>
                      {kundiWardOptions.map((ward) => (
                        <option key={ward._id} value={ward._id}>
                          {ward.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600">
                      Kundi Name
                    </label>
                    <input
                      type="text"
                      value={kundiForm.name}
                      onChange={(event) =>
                        setKundiForm((prev) => ({
                          ...prev,
                          name: event.target.value,
                        }))
                      }
                      className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                      placeholder="e.g. Kundi 1"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600">
                      Latitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={kundiForm.lat}
                      onChange={(event) =>
                        setKundiForm((prev) => ({
                          ...prev,
                          lat: event.target.value,
                        }))
                      }
                      className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                      placeholder="24.8607"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600">
                      Longitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={kundiForm.lng}
                      onChange={(event) =>
                        setKundiForm((prev) => ({
                          ...prev,
                          lng: event.target.value,
                        }))
                      }
                      className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                      placeholder="67.0011"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600">
                      Radius (m)
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={kundiForm.radiusM}
                      onChange={(event) =>
                        setKundiForm((prev) => ({
                          ...prev,
                          radiusM: event.target.value,
                        }))
                      }
                      className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                      placeholder="50"
                      required
                    />
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setActiveForm(null)}
                    className="rounded-lg border border-gray-200 px-4 py-2 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreatingKundi || !kundiWardOptions.length}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white disabled:opacity-70"
                  >
                    {isCreatingKundi ? "Saving..." : "Create Kundi"}
                  </button>
                </div>
                {formError && (
                  <div className="mt-3 text-sm text-red-600">{formError}</div>
                )}
              </form>
            )}

            <div className="flex flex-wrap gap-3 mb-4">
              <select
                value={kundiWardFilter}
                onChange={(event) => setKundiWardFilter(event.target.value)}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
              >
                <option value="">All Wards</option>
                {wards.map((ward) => (
                  <option key={ward._id} value={ward._id}>
                    {ward.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={kundiSearch}
                onChange={(event) => setKundiSearch(event.target.value)}
                placeholder="Search"
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
              />
            </div>

            <div className="space-y-3">
              {kundiLoading && (
                <div className="px-4 py-6 text-sm text-gray-500">
                  Loading kundis...
                </div>
              )}
              {kundiError && (
                <div className="px-4 py-6 text-sm text-red-500">
                  Unable to load kundi points.
                </div>
              )}
              {!kundiLoading && !kundiError && kundiItems.length === 0 && (
                <div className="px-4 py-6 text-sm text-gray-500">
                  No kundi points found.
                </div>
              )}
              {kundiItems.map((point) => (
                <div
                  key={point._id}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium">{point.name}</p>
                    <p className="text-xs text-gray-500">
                      {point.zoneName} - {point.wardName} - {point.radiusM}m
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Pencil
                      size={16}
                      className="cursor-not-allowed text-gray-400"
                    />
                    <Trash2
                      size={16}
                      className="text-gray-300 cursor-not-allowed"
                    />
                  </div>
                </div>
              ))}
            </div>

            {kundiTotalPages > 1 && (
              <div className="flex items-center justify-end gap-2 mt-4 text-sm">
                <button
                  type="button"
                  onClick={() => handleKundiPageChange(kundiPage - 1)}
                  disabled={kundiPage === 1}
                  className="px-3 py-1 rounded-lg border border-gray-200 disabled:opacity-50"
                >
                  Prev
                </button>
                <span className="text-gray-500">
                  Page {kundiPage} of {kundiTotalPages}
                </span>
                <button
                  type="button"
                  onClick={() => handleKundiPageChange(kundiPage + 1)}
                  disabled={kundiPage === kundiTotalPages}
                  className="px-3 py-1 rounded-lg border border-gray-200 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}

        {activeSection === "gts" && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">GTS Points</h3>
              <button
                type="button"
                onClick={() => toggleForm("gts", "gts")}
                className="bg-black text-white px-4 py-2 rounded-xl text-sm"
              >
                + Add GTS
              </button>
            </div>

            {activeForm === "gts" && (
              <form
                onSubmit={handleCreateGts}
                className="mb-6 rounded-2xl border border-gray-200 bg-gray-50 p-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-600">
                      GTS Name
                    </label>
                    <input
                      type="text"
                      value={gtsForm.name}
                      onChange={(event) =>
                        setGtsForm((prev) => ({
                          ...prev,
                          name: event.target.value,
                        }))
                      }
                      className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                      placeholder="e.g. GTS North"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600">
                      Latitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={gtsForm.lat}
                      onChange={(event) =>
                        setGtsForm((prev) => ({
                          ...prev,
                          lat: event.target.value,
                        }))
                      }
                      className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                      placeholder="24.8607"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600">
                      Longitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={gtsForm.lng}
                      onChange={(event) =>
                        setGtsForm((prev) => ({
                          ...prev,
                          lng: event.target.value,
                        }))
                      }
                      className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                      placeholder="67.0011"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600">
                      Radius (m)
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={gtsForm.radiusM}
                      onChange={(event) =>
                        setGtsForm((prev) => ({
                          ...prev,
                          radiusM: event.target.value,
                        }))
                      }
                      className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                      placeholder="80"
                      required
                    />
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setActiveForm(null)}
                    className="rounded-lg border border-gray-200 px-4 py-2 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreatingGts}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white disabled:opacity-70"
                  >
                    {isCreatingGts ? "Saving..." : "Create GTS"}
                  </button>
                </div>
                {formError && (
                  <div className="mt-3 text-sm text-red-600">{formError}</div>
                )}
              </form>
            )}

            <div className="flex flex-wrap gap-3 mb-4">
              <input
                type="text"
                value={gtsSearch}
                onChange={(event) => setGtsSearch(event.target.value)}
                placeholder="Search"
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
              />
            </div>

            <div className="space-y-3">
              {gtsLoading && (
                <div className="px-4 py-6 text-sm text-gray-500">
                  Loading GTS points...
                </div>
              )}
              {gtsError && (
                <div className="px-4 py-6 text-sm text-red-500">
                  Unable to load GTS points.
                </div>
              )}
              {!gtsLoading && !gtsError && filteredGts.length === 0 && (
                <div className="px-4 py-6 text-sm text-gray-500">
                  No GTS points found.
                </div>
              )}
              {filteredGts.map((point) => (
                <div
                  key={point._id}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium">{point.name}</p>
                    <p className="text-xs text-gray-500">
                      {point.radiusM}m radius
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Pencil
                      size={16}
                      className="cursor-not-allowed text-gray-400"
                    />
                    <Trash2
                      size={16}
                      className="text-gray-300 cursor-not-allowed"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === "bins08" && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">0.8 Cubic Bins</h3>
            <div className="flex flex-wrap gap-3 mb-4">
              <select
                value={binWardFilter}
                onChange={(event) => setBinWardFilter(event.target.value)}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
              >
                <option value="">All Wards</option>
                {wards.map((ward) => (
                  <option key={ward._id} value={ward._id}>
                    {ward.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={binSearch}
                onChange={(event) => setBinSearch(event.target.value)}
                placeholder="Search"
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
              />
            </div>

            <div className="space-y-3">
              {binsError && (
                <div className="px-4 py-6 text-sm text-red-500">
                  Unable to load bins.
                </div>
              )}
              {!binsError && filteredBins.length === 0 && (
                <div className="px-4 py-6 text-sm text-gray-500">
                  No bins found.
                </div>
              )}
              {filteredBins.map((bin) => (
                <div
                  key={bin._id}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium">{bin.binNumber}</p>
                    <p className="text-xs text-gray-500">
                      {bin.zoneName} - {bin.wardName} - {bin.radiusM}m radius
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Pencil
                      size={16}
                      className="cursor-not-allowed text-gray-400"
                    />
                    <Trash2
                      size={16}
                      className="text-gray-300 cursor-not-allowed"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === "bins5" && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">5m Bins</h3>
              <button
                type="button"
                onClick={() => toggleForm("bin5", "bins5")}
                className="bg-black text-white px-4 py-2 rounded-xl text-sm"
              >
                + Add Bin
              </button>
            </div>

            {activeForm === "bin5" && (
              <form
                onSubmit={handleCreateBin5}
                className="mb-6 rounded-2xl border border-gray-200 bg-gray-50 p-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-600">
                      Bin Number
                    </label>
                    <input
                      type="text"
                      value={bin5Form.binNumber}
                      onChange={(event) =>
                        setBin5Form({ binNumber: event.target.value })
                      }
                      className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                      placeholder="e.g. 5M-01"
                      required
                    />
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setActiveForm(null)}
                    className="rounded-lg border border-gray-200 px-4 py-2 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreatingBin5}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white disabled:opacity-70"
                  >
                    {isCreatingBin5 ? "Saving..." : "Create Bin"}
                  </button>
                </div>
                {formError && (
                  <div className="mt-3 text-sm text-red-600">{formError}</div>
                )}
              </form>
            )}

            <div className="flex flex-wrap gap-3 mb-4">
              <input
                type="text"
                value={bin5Search}
                onChange={(event) => setBin5Search(event.target.value)}
                placeholder="Search"
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
              />
            </div>

            <div className="space-y-3">
              {!filteredBin5.length && (
                <div className="px-4 py-6 text-sm text-gray-500">
                  No 5m bins found.
                </div>
              )}
              {filteredBin5.map((bin) => (
                <div
                  key={bin._id}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium">{bin.binNumber}</p>
                    <p className="text-xs text-gray-500">
                      5m bins are tracked in operations only.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Pencil
                      size={16}
                      className="cursor-not-allowed text-gray-400"
                    />
                    <Trash2
                      size={16}
                      className="text-gray-300 cursor-not-allowed"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === "hierarchy" && (
          <div className="space-y-4">
          {isLoading && (
            <div className="px-4 py-6 text-sm text-gray-500">
              Loading locations...
            </div>
          )}
          {isError && (
            <div className="px-4 py-6 text-sm text-red-500">
              Unable to load locations.
            </div>
          )}
          {binsError && (
            <div className="px-4 py-2 text-sm text-red-500">
              Unable to load bins for the map.
            </div>
          )}
          {!isLoading && !isError && zonesWithUcs.length === 0 && (
            <div className="px-4 py-6 text-sm text-gray-500">
              No zones found. Create your first zone to get started.
            </div>
          )}
          {zonesWithUcs.map((zone) => (
            <div
              key={zone._id}
              className="border border-gray-300 rounded-2xl bg-gray-50"
            >
              {/* Zone Header */}
              <div className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="bg-gray-200 p-3 rounded-xl">
                    <MapPin size={22} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{zone.name}</h3>
                    <p className="text-xs text-gray-500">
                      {(ucsByZone[zone._id] || []).length} UCs - 
                      {(wardsByZone[zone._id] || []).length} Wards
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <button type="button" onClick={() => toggleZone(zone._id)}>
                    {openZone === zone._id ? (
                      <ChevronUp size={20} />
                    ) : (
                      <ChevronDown size={20} />
                    )}
                  </button>
                  <Pencil
                    size={18}
                    className="cursor-not-allowed text-gray-400"
                  />
                  <Trash2
                    size={18}
                    className="text-gray-300 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* UC List */}
              {openZone === zone._id && (
                <div className="px-8 pb-4 space-y-3">
                  {zone.ucs.length === 0 && (
                    <div className="text-sm text-gray-500">
                      No UCs added yet.
                    </div>
                  )}
                  {zone.ucs.map((uc) => (
                    <div
                      key={uc._id}
                      className="bg-white border border-gray-300 rounded-xl px-5 py-4 flex items-center justify-between shadow-md hover:shadow-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-gray-100 p-3 rounded-xl">
                          <MapPin size={18} />
                        </div>
                        <div>
                          <p className="font-medium">{uc.name}</p>
                          <p className="text-xs text-gray-500">{uc.progress}</p>
                          {(wardsByUc[uc._id] || []).length > 0 ? (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {(wardsByUc[uc._id] || []).map((ward) => (
                                <span
                                  key={ward._id}
                                  className="px-3 py-1 text-xs rounded-full border border-gray-200 bg-gray-50 text-gray-600"
                                >
                                  {ward.name}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <p className="mt-2 text-xs text-gray-400">
                              No wards added yet.
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        {/* Status Badge */}
                        {uc.status === "progress" ? (
                          <span className="px-4 py-1 text-xs rounded-full border border-red-400 text-red-500">
                            In Progress
                          </span>
                        ) : (
                          <span className="px-4 py-1 text-xs rounded-full border border-green-500 text-green-600">
                            Completed
                          </span>
                        )}

                        <Pencil
                          size={16}
                          className="cursor-not-allowed text-gray-400"
                        />
                        <Trash2
                          size={16}
                          className="text-gray-300 cursor-not-allowed"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          </div>
        )}
      </div>
    </div>
  );
}

const NoticeBanner = ({ notice }) => {
  if (!notice) return null;
  const baseStyles = "mx-0 mb-4 rounded-lg border px-4 py-2 text-sm";
  const theme =
    notice.type === "success"
      ? "border-green-200 bg-green-50 text-green-700"
      : "border-red-200 bg-red-50 text-red-700";
  return <div className={`${baseStyles} ${theme}`}>{notice.message}</div>;
};

const useTimedNotice = (durationMs = 4000) => {
  const [notice, setNotice] = useState(null);
  const timerRef = React.useRef(null);

  const clearNotice = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
    setNotice(null);
  };

  const showNotice = (type, message) => {
    if (!message) return;
    clearNotice();
    setNotice({ type, message });
    timerRef.current = setTimeout(() => {
      setNotice(null);
      timerRef.current = null;
    }, durationMs);
  };

  React.useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  return { notice, showNotice, clearNotice };
};
