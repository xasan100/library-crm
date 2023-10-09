import React, { useState } from "react";
import { AiOutlineFileAdd, AiOutlineUserAdd } from "react-icons/ai";
import Modal from "../../generic/Modal";
import ImageUpload from "../ImageUpload/ImageUpload";
import { MdOutlineInsertPhoto } from "react-icons/md";
import FileUpload from "../FileUpload/FileUpload";
import {
  useCreateTeacherMutation,
  useGetTeachersQuery,
} from "../../redux/slice/teachers/TeachersSlice";
import { useGetSciencesQuery } from "../../redux/slice/sciences/SciencesSlice";
import { toast } from "react-toastify";
import CustomInput from "react-phone-number-input/input";
import { useEffect } from "react";
import InputField from "../../generic/InputField";
import Select from "react-select";
import makeAnimated from "react-select/animated";
const INITIAL_STATE = {
  user: {
    username: "",
    password: "",
    first_name: "",
    last_name: "",
    middle_name: "",
    image: "",
  },
  id_card: "",
  salary_type: "FIXED",
  salary: 0,
  date_of_employment: "",
  gender: "MALE",
  address: "",
  description: "",
  experience: "HIGH_CATEGORY",
  language_certificate: "TESOL",
  experience_desc: "",
  language_certificate_file: "",
  sciences: [0],
  lens: "",
  id_card_photo: "",
  survey: "",
  biography: "",
  medical_book: "",
  picture_3x4: "",
};

export default function AddTeacher() {
  const [opne, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(INITIAL_STATE);
  const [createTeacher, { isLoading, isSuccess }] = useCreateTeacherMutation();
  const { data } = useGetTeachersQuery();
  const { data: science } = useGetSciencesQuery();
  const [error, setError] = useState({ salary: "", username: "" });
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    if (hasSubmitted) {
      if (isSuccess) {
        toast.success("O'qituvchi qo'shildi");
        setOpen(false);
      } else if (!isLoading && !isSuccess) {
        toast.error("O'qituvchi qo'shilmadi");
      }
    }
  }, [isSuccess, isLoading, hasSubmitted]);

  // Inputdagi qiymatni olganda raqam yoki raqam emasligini tekshirish uchun qo'shimcha funksiya
  const updateNestedValue = (obj, keys, value) => {
    const newObj = { ...obj };
    let current = newObj;

    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }

    current[keys[keys.length - 1]] = value;
    return newObj;
  };

  //Har bir inputga qiymat berilgan yoki berilmaganini tekshirish
  const isAnyFieldEmpty = (input) => {
    for (let key in input) {
      const value = input[key];

      if (typeof value === "object" && value !== null) {
        // null qiymatini "ob'ekt" sifatida hisoblamaslik uchun shart qo'shdim
        if (Array.isArray(value) && value.length === 0) {
          return true;
        }
        if (value instanceof File) {
          continue; // Faylni tekshirishni tashlab yuborish
        }
        if (isAnyFieldEmpty(value)) {
          // Ichidagi ob'ektlarni rekursiv tekshirish
          return true;
        }
      } else if (value === "" || value === null || value === undefined) {
        // Bo'sh qiymatlarni aniq tekshirish
        return true;
      }
    }
    return false;
  };

  const isDisabled = isAnyFieldEmpty(inputValue);

  //Faqatgina username inputidan qiymat olish chunki u boshqacha component
  const handleUsernameChange = (e) => {
    const value = e;
    const isUsernameExists = data.some(
      (teacher) => teacher.user.username === value
    );

    setInputValue((prev) => ({
      ...prev,
      user: { ...prev.user, username: value },
    }));

    setError((prevError) => ({
      ...prevError,
      username: isUsernameExists ? "Ushbu username allaqachon mavjud!" : "",
    }));
  };

  //Har bir inputdan qiymat olish
  const handleChange = (e) => {
    const { name, value } = e.target;
    const numberPattern = /^[0-9]*$/;
    const keys = name.split(".");

    const newValue =
      keys.length > 1
        ? updateNestedValue(inputValue, keys, value)
        : { ...inputValue, [name]: value };

    setInputValue(newValue);

    if (name === "salary") {
      setError((prevError) => ({
        ...prevError,
        salary:
          numberPattern.test(value) || value === ""
            ? ""
            : "Iltimos faqat raqamlar ishlating",
      }));
    }
  };

  //O'qituvchi qo'shish
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    for (let key in inputValue) {
      if (key === "user") {
        for (let userKey in inputValue[key]) {
          formData.append(`user.${userKey}`, inputValue[key][userKey]);
        }
      } else if (
        key === "sciences" &&
        inputValue[key] &&
        Array.isArray(inputValue[key])
      ) {
        inputValue[key].forEach((value) => {
          formData.append(key, value);
        });
      } else {
        formData.append(key, inputValue[key]);
      }
    }

    try {
      setHasSubmitted(true);
      await createTeacher(formData);
      setInputValue(INITIAL_STATE);
      setHasSubmitted(false);
    } catch (error) {
      toast.error("O'qituvchi qo'shishda xatolik", error.message);
    }
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        type="button"
        className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        <AiOutlineUserAdd
          className="-ml-0.5 mr-1.5 text-xl"
          aria-hidden="true"
        />
        O'qituvchi Qo'shish
      </button>
      {opne && (
        <Modal
          closeModal={onClose}
          addFunc={handleSubmit}
          loader={isLoading}
          isDisabled={isDisabled}
        >
          <div className="grid grid-rows-8 md:grid-cols-4 sm:grid-cols-2 sx:grid-cols-1 gap-2">
            <InputField
              label="Ism"
              id="first-name"
              name="user.first_name"
              type="text"
              autoComplete="first_name"
              handleChange={handleChange}
            />
            <InputField
              label="Familiya"
              id="last-name"
              name="user.last_name"
              type="text"
              autoComplete="last-name"
              handleChange={handleChange}
            />
            <InputField
              label="Otasining Ismi"
              id="middle-name"
              name="user.middle_name"
              type="text"
              autoComplete="middle-name"
              handleChange={handleChange}
            />
            <div className="col-span-1 row-span-1 relative">
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-6 text-gray-900 w-72"
              >
                Foydalanuvchi nomi
              </label>
              <div className="mt-2">
                <CustomInput
                  placeholder="Telfon raqamingiz kiriting qayta takrorlanmagan"
                  maxLength={17}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  onChange={(e) => handleUsernameChange(e)}
                  value={inputValue.username}
                />
              </div>
              {error.username && (
                <p className="text-red-600 absolute text-[12px] -bottom-3">
                  {error.username}
                </p>
              )}
            </div>
            <InputField
              label="Foydalanuvchi Paroli"
              id="password"
              name="user.password"
              type="text"
              autoComplete="password"
              handleChange={handleChange}
            />
            <div className="col-span-1 row-span-1 relative">
              <label
                htmlFor="salary"
                className="block text-sm font-medium leading-6 text-gray-900 w-72"
              >
                Maosh
              </label>
              <div className="mt-2">
                <input
                  id="salary"
                  name="salary"
                  type="text"
                  autoComplete="salary"
                  required
                  onChange={(e) => handleChange(e)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              {error.salary && (
                <p className="text-red-600 absolute text-[12px] -bottom-3">
                  {error.salary}
                </p>
              )}
            </div>
            <ImageUpload
              title={"Passport yoki ID karta rasmi"}
              iconName={<MdOutlineInsertPhoto className="text-5xl" />}
              iconTitle={"Rasmni Yuklash"}
              fileType={"PNG, JPG, JPEG 5mb gacha"}
              LabelFor={"id_card_photo"}
              setInputValue={setInputValue}
              inputValue={inputValue}
            />
            <ImageUpload
              title={"Rasmingiz 3x4"}
              iconName={<MdOutlineInsertPhoto className="text-5xl" />}
              iconTitle={"Rasmni Yuklash"}
              fileType={"PNG, JPG, JPEG 5mb gacha"}
              LabelFor={"picture_3x4"}
              setInputValue={setInputValue}
              inputValue={inputValue}
            />
            <FileUpload
              title={"Til Sertifikati"}
              iconName={<AiOutlineFileAdd className="text-2xl" />}
              LabelFor={"language_certificate_file"}
              setInputValue={setInputValue}
              inputValue={inputValue}
            />
            <FileUpload
              title={"Tarjimai Hol"}
              iconName={<AiOutlineFileAdd className="text-2xl" />}
              LabelFor={"biography"}
              setInputValue={setInputValue}
              inputValue={inputValue}
              acceptedFormats={[".png", ".jpeg", ".jpg", ".gif", ".bmp", ".tiff", ".webp", ".svg"]}

            />
            <FileUpload
              title={"Obyektivka"}
              iconName={<AiOutlineFileAdd className="text-2xl" />}
              LabelFor={"lens"}
              setInputValue={setInputValue}
              inputValue={inputValue}
              acceptedFormats={[".png", ".jpeg", ".jpg", ".gif", ".bmp", ".tiff", ".webp", ".svg"]}

            />
            <FileUpload
              title={"So'rovnoma"}
              iconName={<AiOutlineFileAdd className="text-2xl" />}
              LabelFor={"survey"}
              setInputValue={setInputValue}
              inputValue={inputValue}
              acceptedFormats={[".png", ".jpeg", ".jpg", ".gif", ".bmp", ".tiff", ".webp", ".svg"]}

            />
            <FileUpload
              title={"086 Tibbiy Malumotnoma"}
              iconName={<AiOutlineFileAdd className="text-2xl" />}
              LabelFor={"medical_book"}
              setInputValue={setInputValue}
              inputValue={inputValue}
              acceptedFormats={[".png", ".jpeg", ".jpg", ".gif", ".bmp", ".tiff", ".webp", ".svg"]}

            />
            <FileUpload
              title={"Shaxsiy Rasmingiz"}
              iconName={<AiOutlineFileAdd className="text-2xl" />}
              LabelFor={"user.image"}
              setInputValue={setInputValue}
              inputValue={inputValue}
              acceptedFormats={[".png", ".jpeg", ".jpg", ".gif", ".bmp", ".tiff", ".webp", ".svg"]}

            />
            <InputField
              label="Manzil"
              id="address"
              name="address"
              type="text"
              autoComplete="address"
              handleChange={handleChange}
            />
            <InputField
              label="Izoh"
              id="description"
              name="description"
              type="text"
              autoComplete="description"
              handleChange={handleChange}
            />
            <InputField
              label="Tajriba"
              id="experience_desc"
              name="experience_desc"
              type="text"
              autoComplete="experience_desc"
              handleChange={handleChange}
            />
            <InputField
              label="Passport yoki ID karta raqami"
              id="id_card"
              name="id_card"
              type="text"
              autoComplete="id_card"
              handleChange={handleChange}
            />
            <div className="col-span-1 row-span-1">
              <label
                htmlFor="sciences"
                className="block text-sm font-medium leading-6 text-gray-900 w-72"
              >
                Fan
              </label>
              <div className="mt-2">
                <Select
                  closeMenuOnSelect={false}
                  components={makeAnimated}
                  styles={{
                    control: (baseStyles, state) => ({
                      ...baseStyles,
                      outlineColor: state.isFocused ? "red" : "black",
                      outline: state.isFocused && "0",
                    }),
                  }}
                  isMulti
                  onChange={(e) =>
                    setInputValue({
                      ...inputValue,
                      sciences: e.map((item) => item.value),
                    })
                  }
                  options={
                    isLoading
                      ? []
                      : science.map((item) => {
                          return { value: item.id, label: item.title };
                        })
                  }
                />
              </div>
            </div>
            <div className="col-span-1 row-span-1">
              <label
                htmlFor="work-date"
                className="block text-sm font-medium leading-6 text-gray-900 w-72"
              >
                Ishga qabul qilingan kun
              </label>
              <div className="mt-2">
                <input
                  id="work-date"
                  name="date_of_employment"
                  type="date"
                  autoComplete="work-date"
                  required
                  onChange={(e) => handleChange(e)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="col-span-2 row-span-1">
              <label
                htmlFor="language_certificate"
                className="block text-sm font-medium leading-6 text-gray-900 w-72"
              >
                Sertifikat turi
              </label>
              <div className="mt-2">
                <select
                  id="language_certificate"
                  name="language_certificate"
                  onChange={(e) => handleChange(e)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                >
                  <option value="TESOL">Tesol</option>
                  <option value="CELTA">Celta</option>
                  <option value="IELTS6">IELTS 6+</option>
                  <option value="CEFRB2">CEFR B2+</option>
                </select>
              </div>
            </div>
            <div className="col-span-2 row-span-1">
              <label
                htmlFor="experience"
                className="block text-sm font-medium leading-6 text-gray-900 w-72"
              >
                Tajriba maqomi
              </label>
              <div className="mt-2">
                <select
                  id="experience"
                  name="experience"
                  onChange={(e) => handleChange(e)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                >
                  <option value="HIGH_CATEGORY">Oliy toifa</option>
                  <option value="FIRST_CATEGORY">1-toifa</option>
                  <option value="SECOND_CATEGORY">2-toifa</option>
                </select>
              </div>
            </div>
            <div className="col-span-1 row-span-1">
              <label
                htmlFor="gender"
                className="block text-sm font-medium leading-6 text-gray-900 w-72"
              >
                Jinsi
              </label>
              <div className="mt-2">
                <select
                  id="gender"
                  name="gender"
                  onChange={(e) => handleChange(e)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                >
                  <option value="MALE">Erkak</option>
                  <option value="FEMALE">Ayol</option>
                </select>
              </div>
            </div>
            <div className="col-span-1 row-span-1">
              <label
                htmlFor="salary_type"
                className="block text-sm font-medium leading-6 text-gray-900 w-72"
              >
                Oylik Turi
              </label>
              <div className="mt-2">
                <select
                  id="salary_type"
                  name="salary_type"
                  onChange={(e) => handleChange(e)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                >
                  <option value="FIXED">Doimiy</option>
                  <option value="PER_HOURS">Soatbay</option>
                </select>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
